from backend.models.itinerary import Itinerary, BudgetBreakdown, ItineraryDay, ItineraryActivity
from backend.config.settings import settings

class AIService:
    
    def __init__(self):
        self.api_key = settings.AI_API_KEY
        
    async def generate_itinerary(self, trip_request: dict) -> Itinerary:
        """
        Generates a full itinerary based on user preferences.
        Awaiting user approval before making external AI API requests.
        """
        if not self.api_key:
            print("WARNING: AI_API_KEY is not set in environment.")
            
        print("MOCK: AI generate_itinerary called.")
        
        # System Prompt definition (documenting the exact flow requested by user)
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
        
        RULE: If a required favorite place cannot reasonably fit due to budget or time constraints, 
        DO NOT silently remove it. You MUST explain why it was excluded in the 'explanations' field of the JSON.
        
        Output MUST strictly follow the requested JSON schema.
        """
        print(f"Constructed Prompt:\n{system_prompt}")

        # We would normally execute the HTTP call to OpenAI/Gemini here.
        # e.g., await openai.beta.chat.completions.parse(...)
        
        return Itinerary(
            destination=trip_request['destination_name'],
            days=[
                ItineraryDay(
                    day_number=1,
                    date=trip_request.get('start_date') or "Day 1",
                    theme="Arrival & Exploration",
                    activities=[
                        ItineraryActivity(
                            activity_name="Check-in & Relax",
                            place_id=None,
                            description="Settle into your accommodation and recover from the journey.",
                            cost=0,
                            start_time="02:00 PM",
                            end_time="04:00 PM",
                            duration="2 hours",
                            travel_time="30 mins from airport",
                            latitude=-8.7262,
                            longitude=115.1706
                        ),
                        ItineraryActivity(
                            activity_name="Dinner at Local Market",
                            place_id=None,
                            description="Enjoy authentic local street food and soak in the vibrant atmosphere.",
                            cost=25,
                            start_time="07:00 PM",
                            end_time="09:00 PM",
                            duration="2 hours",
                            travel_time="15 mins",
                            latitude=-8.8291,
                            longitude=115.0886
                        )
                    ]
                )
            ],
            budget_breakdown=BudgetBreakdown(
                accommodation=500, food=300, transportation=100, activities=200, miscellaneous=100, total=1200
            ),
            explanations=[
                "Mock Explanation: This is a placeholder itinerary. The external AI API call has been skipped pending user approval."
            ]
        )

    async def regenerate_itinerary(self, trip_id: str, payload: dict) -> Itinerary:
        """
        Surgically regenerates the itinerary based on user changes.
        """
        import json
        if not self.api_key:
            print("WARNING: AI_API_KEY is not set in environment.")
            
        print(f"MOCK: AI regenerate_itinerary called for trip {trip_id}.")
        
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
        Output MUST strictly follow the requested JSON schema.
        """
        
        print(f"Constructed Regeneration Prompt:\n{system_prompt}")
        
        # We would execute the OpenAI/Gemini call here.
        # For now, we return a mock that attempts to simulate the update based on current_itinerary.
        
        mock_itinerary = payload['current_itinerary']
        
        # Ensure fallback values exist to prevent Pydantic validation errors
        for day in mock_itinerary.get('days', []):
            for activity in day.get('activities', []):
                if 'duration' not in activity:
                    activity['duration'] = 'TBD'
                if 'travel_time' not in activity:
                    activity['travel_time'] = 'TBD'
                if 'cost' not in activity:
                    activity['cost'] = 0
        
        # Visually mock the response by adding an explanation
        explanations = mock_itinerary.get('explanations', [])
        explanations.append(f"AI Regeneration Note: Processed {len(payload['change_set'].get('added_places', []))} additions and {len(payload['change_set'].get('removed_places', []))} removals. User feedback considered: '{payload.get('feedback', '')}'. API call skipped pending approval.")
        
        # Parse it back through the Pydantic model to ensure validity
        return Itinerary(
            destination=mock_itinerary['destination'],
            days=mock_itinerary['days'],
            budget_breakdown=mock_itinerary['budget_breakdown'],
            explanations=explanations
        )
    async def optimize_budget(self, trip_id: str, payload: dict) -> Itinerary:
        """
        Optimizes an existing itinerary to fit a new budget.
        """
        import json
        print(f"MOCK: AI optimize_budget called for trip {trip_id} with target budget: {payload['target_budget']}")
        
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
        Output MUST strictly follow the requested JSON schema.
        """
        print(f"Constructed Optimize Prompt:\n{system_prompt}")

        mock_itinerary = payload['current_itinerary']
        
        # MOCK LOGIC: We will artificially reduce the cost of all activities by 30% to simulate savings
        original_activities_cost = mock_itinerary['budget_breakdown']['activities']
        savings = 0
        
        for day in mock_itinerary.get('days', []):
            for activity in day.get('activities', []):
                # Ensure fields exist for Pydantic
                if 'duration' not in activity: activity['duration'] = 'TBD'
                if 'travel_time' not in activity: activity['travel_time'] = 'TBD'
                if 'cost' not in activity: activity['cost'] = 0
                
                # Apply 30% discount simulation
                if activity.get('cost', 0) > 0:
                    old_cost = activity['cost']
                    new_cost = max(0, int(old_cost * 0.7))
                    savings += (old_cost - new_cost)
                    activity['cost'] = new_cost
                    activity['description'] += f" [Optimized: Saved ${old_cost - new_cost}]"

        # Update budget breakdown
        if mock_itinerary.get('budget_breakdown'):
            mock_itinerary['budget_breakdown']['activities'] -= savings
            mock_itinerary['budget_breakdown']['total'] -= savings

        explanations = mock_itinerary.get('explanations', [])
        explanations.append(f"AI Optimization Note: Reduced total cost by ${savings} by finding cheaper alternatives. API call skipped pending approval.")

        return Itinerary(
            destination=mock_itinerary['destination'],
            days=mock_itinerary['days'],
            budget_breakdown=mock_itinerary['budget_breakdown'],
            explanations=explanations
        )

ai_service = AIService()
