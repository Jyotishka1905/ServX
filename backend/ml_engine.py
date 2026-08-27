import numpy as np
from sklearn.preprocessing import MinMaxScaler

def compute_recommendation_scores(professionals_list, customer_preferences):
    """
    Computes a match score (0-100%) for a list of professionals based on:
    - Experience (higher is better)
    - Rating (higher is better)
    - Price (lower/closer to budget is better)
    - Location match (exact match gets highest weight)
    """
    if not professionals_list:
        return []

    # Extract criteria preferences
    target_location = customer_preferences.get("location", "").strip().lower()
    max_budget = customer_preferences.get("max_price", float('inf'))

    scores = []
    features_matrix = []

    for prof in professionals_list:
        # 1. Location Score (1.0 if exact match, 0.3 otherwise)
        loc_match = 1.0 if target_location and target_location in prof.get("location", "").lower() else 0.5

        # 2. Price Score (Penalize if it exceeds max budget, otherwise reward lower price)
        price = prof.get("price", 500)
        if max_budget and price > max_budget:
            price_score = 0.2
        else:
            price_score = 1.0 - (price / 5000.0) # Normalized assuming 5000 max typical scale
            price_score = max(0.1, price_score)

        features_matrix.append([
            prof.get("experience", 1),
            prof.get("rating", 4.0),
            price_score,
            loc_match
        ])

    # Fix for edge case: MinMaxScaler fails or returns NaN if there is only 1 professional in the list
    if len(features_matrix) == 1:
        prof = professionals_list[0]
        prof["match_score"] = 95.0 # High default match for single results
        return [prof]

    # Normalize features using MinMaxScaler to scale everything between 0 and 1
    scaler = MinMaxScaler()
    normalized_matrix = scaler.fit_transform(features_matrix)

    # Define weights for each feature: [Experience, Rating, Price, Location]
    weights = np.array([0.20, 0.30, 0.20, 0.30])

    for i, prof in enumerate(professionals_list):
        # Calculate weighted sum score
        weighted_score = np.dot(normalized_matrix[i], weights)
        
        # Convert to a clean 0-100 percentage
        match_percentage = round(float(weighted_score) * 100, 1)
        
        # Ensure it stays within bounds
        match_percentage = min(max(match_percentage, 15.0), 99.5)

        # Attach score to professional object
        prof["match_score"] = match_percentage
        scores.append(prof)

    # Sort professionals by match score descending (best match first)
    scores.sort(key=lambda x: x["match_score"], reverse=True)
    return scores