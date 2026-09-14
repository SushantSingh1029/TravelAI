import json
import google.generativeai as genai
from pydantic import ValidationError
from backend.models.itinerary import Itinerary, BudgetBreakdown, ItineraryDay, ItineraryActivity
from backend.config.settings import settings

class AIService:
    def __init__(self):
        self.api_key = settings.AI_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            # Use gemini-3.6-flash for speed and JSON structure support
            self.model = genai.GenerativeModel("gemini-3.6-flash")
        else:
            print("WARNING: AI_API_KEY is not set in environment.")
            self.model = None
            
    async def generate_itinerary(self, trip_request: dict) -> Itinerary:
        print("REAL GEMINI: AI generate_itinerary started")
        if not self.model:
            raise ValueError("AI_API_KEY missing, cannot use real Gemini API.")
            
        system_prompt = f"""
        You are an expert travel planner. Create a detailed itinerary for {trip_request['destination_name']}.
        
        HARD CONSTRAINTS:
        - Duration: {trip_request['days']} days
        - Budget: {trip_request['budget']}
        - Travellers: {trip_request['travellers']}
        - Required Favorite Places: {[p['name'] for p in trip_request['favorite_places']]}
        
        SOFT PREFERENCES:
        - Interests: {trip_request.get('preferences', {}).get('interests', [])}
        - Travel Style: {trip_request.get('preferences', {}).get('travelStyle', 'Balanced')}
        
        Generate a strictly valid JSON matching the exact provided schema. 
        If a required favorite place cannot reasonably fit due to budget or time constraints, 
        do NOT silently remove it. You MUST explain why it was excluded in the 'explanations' field.
        """
        
        try:
            response = self.model.generate_content(
                system_prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=Itinerary
                ),
            )
            print("REAL GEMINI: AI generate_itinerary response received")
            
            itinerary_data = json.loads(response.text)
            validated_itinerary = Itinerary(**itinerary_data)
            print("REAL GEMINI: Itinerary validation passed")
            return validated_itinerary
        except ValidationError as e:
            print(f"REAL GEMINI FAIL: Validation Error: {e}")
            raise Exception("Gemini returned invalid structured output")
        except Exception as e:
            print(f"REAL GEMINI FAIL: Error parsing JSON or connecting to API: {e}")
            raise

    async def regenerate_itinerary(self, trip_id: str, payload: dict) -> Itinerary:
        print(f"REAL GEMINI: AI regenerate_itinerary started for trip {trip_id}")
        if not self.model:
            raise ValueError("AI_API_KEY missing, cannot use real Gemini API.")
            
        system_prompt = f"""
        You are an expert travel planner performing surgical edits to an existing itinerary for {payload['destination_name']}.
        
        CURRENT TRIP CONSTRAINTS:
        - Days: {payload['trip_config']['days']}
        - Budget: {payload['trip_config']['budget']}
        - Travellers: {payload['trip_config']['travellers']}
        
        YOUR MISSION:
        1. Start with the following Base Itinerary:
        {json.dumps(payload['current_itinerary'], indent=2)}
        
        2. APPLY THE CHANGE SET:
        - REMOVE these places explicitly: {payload['change_set'].get('removed_places', [])}
        - ADD these places logically: {[p['name'] for p in payload['change_set'].get('added_places', [])]}
        
        3. USER FEEDBACK:
        "{payload.get('feedback', 'No additional feedback provided.')}"
        
        CRITICAL RULE: Preserve as much of the existing itinerary as possible. Do NOT randomly recreate the entire trip. 
        Only adjust start/end times and travel times logically to accommodate the added places or cover gaps left by removed places.
        Recalculate the cost.
        Return strictly valid JSON matching the exact provided schema.
        """
        
        try:
            response = self.model.generate_content(
                system_prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=Itinerary
                ),
            )
            print("REAL GEMINI: AI regenerate_itinerary response received")
            
            itinerary_data = json.loads(response.text)
            validated_itinerary = Itinerary(**itinerary_data)
            print("REAL GEMINI: Itinerary validation passed")
            return validated_itinerary
        except ValidationError as e:
            print(f"REAL GEMINI FAIL: Validation Error: {e}")
            raise Exception("Gemini returned invalid structured output during regeneration")
        except Exception as e:
            print(f"REAL GEMINI FAIL: Error: {e}")
            raise

    async def optimize_budget(self, trip_id: str, payload: dict) -> Itinerary:
        print(f"REAL GEMINI: AI optimize_budget started for trip {trip_id}")
        if not self.model:
            raise ValueError("AI_API_KEY missing, cannot use real Gemini API.")
            
        system_prompt = f"""
        You are an expert travel planner performing a budget optimization for an existing itinerary.
        
        CURRENT TRIP CONSTRAINTS:
        - Target Budget: {payload['target_budget']}
        
        YOUR MISSION:
        1. Start with the following Base Itinerary:
        {json.dumps(payload['current_itinerary'], indent=2)}
        
        2. Identify cheaper alternatives, downgrade transport, or swap paid attractions for free ones.
        3. CRITICAL: Preserve the destination, duration, and required favourite places.
        4. Recalculate the cost.
        Return strictly valid JSON matching the exact provided schema.
        """
        
        try:
            response = self.model.generate_content(
                system_prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=Itinerary
                ),
            )
            print("REAL GEMINI: AI optimize_budget response received")
            
            itinerary_data = json.loads(response.text)
            validated_itinerary = Itinerary(**itinerary_data)
            print("REAL GEMINI: Itinerary validation passed")
            return validated_itinerary
        except ValidationError as e:
            print(f"REAL GEMINI FAIL: Validation Error: {e}")
            raise Exception("Gemini returned invalid structured output during budget optimization")
        except Exception as e:
            print(f"REAL GEMINI FAIL: Error: {e}")
            raise

ai_service = AIService()
