import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="models/gemini-1.5-pro-latest")

def generate_meal_times(events: list, meals_per_day: int = 3):
    formatted_events = "\n".join([
        f"- {e['summary']} from {e['start']} to {e['end']}"
        for e in events
    ])

    prompt = f"""
    Given the following calendar events, suggest {meals_per_day} optimal meal times
    (breakfast, lunch, dinner) that do not conflict with these events:

    Events:
    {formatted_events}

    Return a list of times in 24-hour format, one per line.
    """

    try:
        response = model.generate_content(prompt)
        return response.text.strip().splitlines()
    except Exception as e:
        return [f"Error from Gemini: {str(e)}"]
    

def generate_meal_ideas(preferences):
    prompt_parts = [
        f"Suggest {preferences.meals_per_day or 3} meals based on the following user preferences:"
    ]

    if preferences.meal_goal:
        prompt_parts.append(f"- Goal: {preferences.meal_goal}")

    if preferences.dietary_restrictions:
        prompt_parts.append(f"- Dietary restrictions: {preferences.dietary_restrictions}")

    if preferences.favorite_cuisines:
        prompt_parts.append(f"- Favorite cuisines: {', '.join(preferences.favorite_cuisines)}")

    if preferences.preferred_meal_times:
        prompt_parts.append(f"- Preferred meal times: {', '.join(preferences.preferred_meal_times)}")

    if preferences.daily_calories:
        prompt_parts.append(f"- Target daily calories: {preferences.daily_calories}")

    if preferences.allergies:
        prompt_parts.append(f"- Avoid ingredients: {', '.join(preferences.allergies)}")

    if preferences.max_time_minutes:
        prompt_parts.append(f"- Max cooking time: {preferences.max_time_minutes} minutes")

    prompt_parts.append("Return a simple list of meal names, one per line. Do not include descriptions or calories.")

    prompt = "\n".join(prompt_parts)

    try:
        response = model.generate_content(prompt)
        return response.text.strip().splitlines()
    except Exception as e:
        return [f"Error from Gemini: {str(e)}"]



def generate_meal_plan(events: list, preferences: dict, meal_history: list = None):
    formatted_events = "\n".join([
        f"- {e.start} to {e.end}: {e.summary or 'Busy'}"
        for e in events
    ])

    # 🧠 New: Build recent meals list if available
    recent_meals_text = ""
    if meal_history:
        recent_meals = []
        for day in meal_history:
            for meal in day["meal_plan"]:
                if "meal_name" in meal:
                    recent_meals.append(meal["meal_name"])
        
        if recent_meals:
            recent_meals_text = (
                "\nAvoid suggesting these meals again (user had them recently):\n" +
                "\n".join([f"- {meal}" for meal in recent_meals])
            )
    
    # 🛠 Build the full AI prompt
    prompt = f"""
    You are an intelligent meal planning assistant. Based on the user's schedule and preferences, suggest meals for today.

    Calendar:
    {formatted_events}

    Preferences:
    - Goal: {preferences['meal_goal']}
    - Restrictions: {preferences['dietary_restrictions']}
    - Favorite cuisines: {', '.join(preferences['favorite_cuisines'])}
    - Preferred meal times: {', '.join(preferences['preferred_meal_times'])}
    - Daily calories: {preferences['daily_calories']}
    - Allergies: {', '.join(preferences['allergies'])}
    - Max cooking time: {preferences['max_time_minutes']} mins

    {recent_meals_text}

    Suggest {preferences['meals_per_day']} meals. For each, include:
    - Time slot (24-hour format)
    - Meal name
    - Estimated calories
    - 1-2 tags (e.g., quick, high-protein)

    ONLY respond with a structured list in the following exact format, without any extra descriptions or text:

    [Time] - [Meal Name] - [Calories as a number only] - [Tags separated by commas]

    DO NOT write anything else.  
    DO NOT describe the meals.  
    DO NOT add paragraphs or explanations.
    Just output the meal list directly, exactly in the format specified above.
    """


    try:
        response = model.generate_content(prompt)
        return response.text.strip().splitlines()
    except Exception as e:
        return [f"Error from Gemini: {str(e)}"]
