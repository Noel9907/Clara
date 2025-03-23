import React, { useState, useEffect } from 'react';
import { FaUtensils, FaRunning, FaBed, FaHeart, FaBrain, FaSpinner } from 'react-icons/fa';
import './lifestyleTab.css'

const LifestyleTab = () => {
  const [loading, setLoading] = useState(true);
  const [conditions, setConditions] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [activeSection, setActiveSection] = useState('diet');
  
  // Simulate fetching patient's medical conditions
  useEffect(() => {
    const fetchConditions = async () => {
      try {
        // Replace with actual API call
        // const response = await fetch('/api/patient/conditions');
        // const data = await response.json();
        
        // Simulated data for development
        const data = [
          { id: 1, name: 'Hypertension' },
          { id: 2, name: 'Type 2 Diabetes' },
          { id: 3, name: 'Asthma' },
          { id: 4, name: 'Arthritis' }
        ];
        
        setConditions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conditions:', error);
        setLoading(false);
      }
    };
    
    fetchConditions();
  }, []);
  
  // Function to fetch lifestyle suggestions based on condition
  const fetchSuggestions = async (conditionName) => {
    setLoading(true);
    try {
      // Replace with actual API call to your AI service
      // const response = await fetch(`/api/lifestyle-suggestions?condition=${conditionName}`);
      // const data = await response.json();
      
      // Simulated delay and response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample data - in production this would come from your AI service
      const mockSuggestions = {
        condition: conditionName,
        diet: {
          recommendedFoods: [
            "Leafy greens (spinach, kale, arugula)",
            "Berries (blueberries, strawberries)",
            "Fatty fish (salmon, mackerel)",
            "Whole grains (quinoa, brown rice)",
            "Legumes (beans, lentils)"
          ],
          foodsToAvoid: [
            "Processed meats (bacon, sausage)",
            "Added sugars (candy, cookies)",
            "Refined carbohydrates (white bread, pasta)",
            "Fried foods",
            "High-sodium foods (canned soups, processed snacks)"
          ],
          mealPlan: [
            "Breakfast: Greek yogurt with berries and nuts",
            "Lunch: Grilled chicken salad with olive oil dressing",
            "Dinner: Baked salmon with quinoa and steamed vegetables",
            "Snacks: Apple slices with almond butter or vegetable sticks with hummus"
          ]
        },
        exercise: {
          recommendedActivities: [
            "Walking (30 minutes daily)",
            "Swimming (2-3 times per week)",
            "Stationary cycling (low impact)",
            "Strength training (2 times per week)",
            "Yoga or tai chi (for flexibility and stress reduction)"
          ],
          precautions: [
            "Start slowly and gradually increase intensity",
            "Monitor blood pressure before and after exercise",
            "Stay hydrated throughout workout sessions",
            "Avoid exercise during extreme heat",
            "Stop if experiencing chest pain, dizziness, or severe shortness of breath"
          ],
          weeklyPlan: [
            "Monday: 30-minute walk + 15-minute stretching",
            "Tuesday: 20-minute water aerobics or swimming",
            "Wednesday: Rest or gentle yoga",
            "Thursday: 30-minute walk + light resistance training",
            "Friday: 20-minute stationary bike",
            "Saturday: 40-minute outdoor activity (walking, gardening)",
            "Sunday: Rest or gentle stretching"
          ]
        },
        sleep: {
          recommendations: [
            "Aim for 7-8 hours of sleep per night",
            "Maintain consistent sleep and wake times",
            "Create a cool, dark, quiet sleeping environment",
            "Limit screen time 1 hour before bed",
            "Avoid caffeine after 2pm"
          ],
          techniques: [
            "Progressive muscle relaxation before bed",
            "Deep breathing exercises",
            "Meditation or guided imagery",
            "White noise machine if environment is noisy",
            "Journal before bed to clear thoughts"
          ]
        },
        mentalHealth: {
          stressManagement: [
            "Daily meditation (5-15 minutes)",
            "Mindfulness practice during daily activities",
            "Deep breathing exercises throughout the day",
            "Connect with friends and family regularly",
            "Limit news and social media consumption"
          ],
          resources: [
            "Mental health apps (Headspace, Calm, etc.)",
            "Local support groups",
            "Telehealth counseling options",
            "Stress management workshops",
            "Crisis hotlines and resources"
          ]
        }
      };
      
      setSuggestions(mockSuggestions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setLoading(false);
    }
  };
  
  const handleConditionChange = (e) => {
    const condition = e.target.value;
    setSelectedCondition(condition);
    if (condition) {
      fetchSuggestions(condition);
    } else {
      setSuggestions(null);
    }
  };
  
  return (
    <div className="lifestyle-container">
      <div className="lifestyle-header">
        <h2>Lifestyle Recommendations</h2>
        <p>Get personalized suggestions based on your health conditions</p>
        
        <div className="condition-selector">
          <label htmlFor="condition-select">Select health condition:</label>
          <select 
            id="condition-select" 
            value={selectedCondition} 
            onChange={handleConditionChange}
            className="condition-select"
          >
            <option value="">-- Select condition --</option>
            {conditions.map(condition => (
              <option key={condition.id} value={condition.name}>
                {condition.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner-icon" />
          <p>Loading recommendations...</p>
        </div>
      ) : suggestions ? (
        <div className="lifestyle-content">
          <div className="lifestyle-nav">
            <button 
              className={`lifestyle-nav-btn ${activeSection === 'diet' ? 'active' : ''}`}
              onClick={() => setActiveSection('diet')}
            >
              <FaUtensils className="nav-icon" />
              <span>Diet</span>
            </button>
            <button 
              className={`lifestyle-nav-btn ${activeSection === 'exercise' ? 'active' : ''}`}
              onClick={() => setActiveSection('exercise')}
            >
              <FaRunning className="nav-icon" />
              <span>Exercise</span>
            </button>
            <button 
              className={`lifestyle-nav-btn ${activeSection === 'sleep' ? 'active' : ''}`}
              onClick={() => setActiveSection('sleep')}
            >
              <FaBed className="nav-icon" />
              <span>Sleep</span>
            </button>
            <button 
              className={`lifestyle-nav-btn ${activeSection === 'mental' ? 'active' : ''}`}
              onClick={() => setActiveSection('mental')}
            >
              <FaBrain className="nav-icon" />
              <span>Mental Health</span>
            </button>
          </div>
          
          <div className="lifestyle-details">
            <h3>Suggestions for {suggestions.condition}</h3>
            
            {activeSection === 'diet' && (
              <div className="suggestion-section">
                <div className="suggestion-card">
                  <h4>Recommended Foods</h4>
                  <ul className="suggestion-list">
                    {suggestions.diet.recommendedFoods.map((food, index) => (
                      <li key={index}>{food}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="suggestion-card">
                  <h4>Foods to Avoid</h4>
                  <ul className="suggestion-list warning">
                    {suggestions.diet.foodsToAvoid.map((food, index) => (
                      <li key={index}>{food}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="suggestion-card full-width">
                  <h4>Sample Meal Plan</h4>
                  <ul className="suggestion-list meal-plan">
                    {suggestions.diet.mealPlan.map((meal, index) => (
                      <li key={index}>{meal}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="disclaimer">
                  <FaHeart className="disclaimer-icon" />
                  <p>These dietary suggestions are general guidelines. Please consult with your healthcare provider or a registered dietitian for personalized advice.</p>
                </div>
              </div>
            )}
            
            {activeSection === 'exercise' && (
              <div className="suggestion-section">
                <div className="suggestion-card">
                  <h4>Recommended Activities</h4>
                  <ul className="suggestion-list">
                    {suggestions.exercise.recommendedActivities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="suggestion-card">
                  <h4>Exercise Precautions</h4>
                  <ul className="suggestion-list warning">
                    {suggestions.exercise.precautions.map((precaution, index) => (
                      <li key={index}>{precaution}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="suggestion-card full-width">
                  <h4>Weekly Exercise Plan</h4>
                  <ul className="suggestion-list schedule">
                    {suggestions.exercise.weeklyPlan.map((day, index) => (
                      <li key={index}>{day}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="disclaimer">
                  <FaHeart className="disclaimer-icon" />
                  <p>Always consult with your healthcare provider before starting a new exercise program, especially if you have existing health conditions.</p>
                </div>
              </div>
            )}
            
            {activeSection === 'sleep' && (
              <div className="suggestion-section">
                <div className="suggestion-card">
                  <h4>Sleep Recommendations</h4>
                  <ul className="suggestion-list">
                    {suggestions.sleep.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="suggestion-card">
                  <h4>Sleep Improvement Techniques</h4>
                  <ul className="suggestion-list">
                    {suggestions.sleep.techniques.map((technique, index) => (
                      <li key={index}>{technique}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="disclaimer">
                  <FaHeart className="disclaimer-icon" />
                  <p>If you continue to experience sleep problems despite these recommendations, please consult with your healthcare provider.</p>
                </div>
              </div>
            )}
            
            {activeSection === 'mental' && (
              <div className="suggestion-section">
                <div className="suggestion-card">
                  <h4>Stress Management</h4>
                  <ul className="suggestion-list">
                    {suggestions.mentalHealth.stressManagement.map((strategy, index) => (
                      <li key={index}>{strategy}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="suggestion-card">
                  <h4>Mental Health Resources</h4>
                  <ul className="suggestion-list">
                    {suggestions.mentalHealth.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="disclaimer">
                  <FaHeart className="disclaimer-icon" />
                  <p>These are general suggestions for mental wellbeing. If you're experiencing severe stress, anxiety, or depression, please seek professional help.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <FaHeart className="empty-icon" />
          <h3>Select a health condition to get personalized lifestyle recommendations</h3>
          <p>Our AI will provide tailored suggestions for diet, exercise, sleep, and mental health based on your specific condition.</p>
        </div>
      )}
    </div>
  );
};

export default LifestyleTab;