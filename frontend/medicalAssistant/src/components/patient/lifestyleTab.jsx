import React, { useState, useEffect } from 'react';
import { FaUtensils, FaRunning, FaBed, FaBrain, FaHeart, FaSpinner } from 'react-icons/fa';
import './lifestyleTab.css';

const LifestyleTab = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState(null);
  const [activeSection, setActiveSection] = useState('diet');
  const [error, setError] = useState(null);

  // Fetch lifestyle recommendations when component mounts
  useEffect(() => {
    const fetchLifestyleData = async () => {
      try {
        const name = "allen";
        setLoading(true);

        const response = await fetch('http://localhost:3000/api/get/getlifestyle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name || 'allen' }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching lifestyle data: ${response.status}`);
        }

        const data = await response.json();
        processLifestyleData(data.lifestylePlan);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lifestyle data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchLifestyleData();
  }, [user?.name]);

  // Process and parse the lifestyle data from the API
  const processLifestyleData = (lifestylePlanText) => {
    try {
      // The structure to fill
      const lifestylePlan = {
        diet: {
          recommendedFoods: [],
          foodsToAvoid: [],
          mealPlan: []
        },
        exercise: {
          recommendedActivities: [],
          precautions: [],
          weeklyPlan: []
        },
        sleep: {
          recommendations: [],
          techniques: []
        },
        mentalHealth: {
          stressManagement: [],
          resources: []
        }
      };

      // Parse exercise section (section 1)
      const exerciseMatch = lifestylePlanText.match(/1\.\s*\*Exercise Plan\*([\s\S]*?)(?=2\.|$)/);
      if (exerciseMatch && exerciseMatch[1]) {
        const exerciseSection = exerciseMatch[1];

        // Extract recommended activities
        const activitiesMatch = exerciseSection.match(/\*Recommended Activities:\*([\s\S]*?)(?=\*Exercise Precautions:|$)/);
        if (activitiesMatch && activitiesMatch[1]) {
          lifestylePlan.exercise.recommendedActivities = activitiesMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }

        // Extract exercise precautions
        const precautionsMatch = exerciseSection.match(/\*Exercise Precautions:\*([\s\S]*?)(?=\*Weekly Exercise Plan:|$)/);
        if (precautionsMatch && precautionsMatch[1]) {
          lifestylePlan.exercise.precautions = precautionsMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }

        // Extract weekly exercise plan
        const planMatch = exerciseSection.match(/\*Weekly Exercise Plan:\*([\s\S]*?)(?=\n\d\.|$)/);
        if (planMatch && planMatch[1]) {
          lifestylePlan.exercise.weeklyPlan = planMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }
      }

      // Parse sleep section (section 2)
      const sleepMatch = lifestylePlanText.match(/2\.\s*\*Sleep Schedule\*([\s\S]*?)(?=3\.|$)/);
      if (sleepMatch && sleepMatch[1]) {
        const sleepSection = sleepMatch[1];

        // Extract sleep recommendations
        const recommendationsMatch = sleepSection.match(/\*Sleep Recommendations:\*([\s\S]*?)(?=\*Sleep Improvement Techniques:|$)/);
        if (recommendationsMatch && recommendationsMatch[1]) {
          lifestylePlan.sleep.recommendations = recommendationsMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }

        // Extract sleep improvement techniques
        const techniquesMatch = sleepSection.match(/\*Sleep Improvement Techniques:\*([\s\S]*?)(?=\n\d\.|$)/);
        if (techniquesMatch && techniquesMatch[1]) {
          lifestylePlan.sleep.techniques = techniquesMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }
      }

      // Parse mental health section (section 3)
      const mentalMatch = lifestylePlanText.match(/3\.\s*\*Mental Health\*([\s\S]*?)(?=4\.|$)/);
      if (mentalMatch && mentalMatch[1]) {
        const mentalSection = mentalMatch[1];

        // Extract stress management
        const stressMatch = mentalSection.match(/\*Stress Management:\*([\s\S]*?)(?=\*Mental Health Resources:|$)/);
        if (stressMatch && stressMatch[1]) {
          lifestylePlan.mentalHealth.stressManagement = stressMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }

        // Extract mental health resources
        const resourcesMatch = mentalSection.match(/\*Mental Health Resources:\*([\s\S]*?)(?=\n\d\.|$)/);
        if (resourcesMatch && resourcesMatch[1]) {
          lifestylePlan.mentalHealth.resources = resourcesMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }
      }

      // Parse diet section (section 4)
      const dietMatch = lifestylePlanText.match(/4\.\s*\*Diet Plan\*([\s\S]*?)(?=\n\d\.|$)/);
      if (dietMatch && dietMatch[1]) {
        const dietSection = dietMatch[1];

        // Extract recommended foods
        const recommendedFoodsMatch = dietSection.match(/\*Recommended Foods:\*([\s\S]*?)(?=\*Foods to Avoid:|$)/);
        if (recommendedFoodsMatch && recommendedFoodsMatch[1]) {
          lifestylePlan.diet.recommendedFoods = recommendedFoodsMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }

        // Extract foods to avoid
        const avoidFoodsMatch = dietSection.match(/\*Foods to Avoid:\*([\s\S]*?)(?=\*Sample Meal Plan:|$)/);
        if (avoidFoodsMatch && avoidFoodsMatch[1]) {
          lifestylePlan.diet.foodsToAvoid = avoidFoodsMatch[1]
            .split('-')
            .filter(item => item.trim())
            .map(item => item.trim());
        }

        // Extract sample meal plan
        const mealPlanMatch = dietSection.match(/\*Sample Meal Plan:\*([\s\S]*?)(?=\n\d\.|$)/);
        if (mealPlanMatch && mealPlanMatch[1]) {
          // Extract individual meal sections
          const breakfast = mealPlanMatch[1].match(/\*Breakfast:\*(.*?)(?=\*Lunch:|$)/);
          const lunch = mealPlanMatch[1].match(/\*Lunch:\*(.*?)(?=\*Dinner:|$)/);
          const dinner = mealPlanMatch[1].match(/\*Dinner:\*(.*?)(?=\*Snacks:|$)/);
          const snacks = mealPlanMatch[1].match(/\*Snacks:\*(.*?)(?=\n\d\.|$)/);

          if (breakfast && breakfast[1].trim()) lifestylePlan.diet.mealPlan.push(`Breakfast: ${breakfast[1].trim()}`);
          if (lunch && lunch[1].trim()) lifestylePlan.diet.mealPlan.push(`Lunch: ${lunch[1].trim()}`);
          if (dinner && dinner[1].trim()) lifestylePlan.diet.mealPlan.push(`Dinner: ${dinner[1].trim()}`);
          if (snacks && snacks[1].trim()) lifestylePlan.diet.mealPlan.push(`Snacks: ${snacks[1].trim()}`);
        }
      }

      setSuggestions(lifestylePlan);
    } catch (error) {
      console.error('Error processing lifestyle data:', error);
      setError('Failed to process lifestyle recommendations');
    }
  };

  // Function to directly parse the lifestyle data as shown in the example
  const parseStructuredData = (data) => {
    try {
      // Create the structure
      const lifestylePlan = {
        diet: {
          recommendedFoods: [],
          foodsToAvoid: [],
          mealPlan: []
        },
        exercise: {
          recommendedActivities: [],
          precautions: [],
          weeklyPlan: []
        },
        sleep: {
          recommendations: [],
          techniques: []
        },
        mentalHealth: {
          stressManagement: [],
          resources: []
        }
      };

      // Parse each section of the data
      const sections = data.split(/\d+\.\s*\*/);

      for (let section of sections) {
        if (!section.trim()) continue;

        if (section.startsWith('Exercise Plan')) {
          const lines = section.split('\n').filter(line => line.trim());
          let currentCategory = '';

          for (let line of lines) {
            if (line.includes('*Recommended Activities:*')) {
              currentCategory = 'activities';
            } else if (line.includes('*Exercise Precautions:*')) {
              currentCategory = 'precautions';
            } else if (line.includes('*Weekly Exercise Plan:*')) {
              currentCategory = 'plan';
            } else if (line.trim().startsWith('-')) {
              const content = line.replace('-', '').trim();
              if (currentCategory === 'activities') {
                lifestylePlan.exercise.recommendedActivities.push(content);
              } else if (currentCategory === 'precautions') {
                lifestylePlan.exercise.precautions.push(content);
              } else if (currentCategory === 'plan') {
                lifestylePlan.exercise.weeklyPlan.push(content);
              }
            }
          }
        } else if (section.startsWith('Sleep Schedule')) {
          const lines = section.split('\n').filter(line => line.trim());
          let currentCategory = '';

          for (let line of lines) {
            if (line.includes('*Sleep Recommendations:*')) {
              currentCategory = 'recommendations';
            } else if (line.includes('*Sleep Improvement Techniques:*')) {
              currentCategory = 'techniques';
            } else if (line.trim().startsWith('-')) {
              const content = line.replace('-', '').trim();
              if (currentCategory === 'recommendations') {
                lifestylePlan.sleep.recommendations.push(content);
              } else if (currentCategory === 'techniques') {
                lifestylePlan.sleep.techniques.push(content);
              }
            }
          }
        } else if (section.startsWith('Mental Health')) {
          const lines = section.split('\n').filter(line => line.trim());
          let currentCategory = '';

          for (let line of lines) {
            if (line.includes('*Stress Management:*')) {
              currentCategory = 'stress';
            } else if (line.includes('*Mental Health Resources:*')) {
              currentCategory = 'resources';
            } else if (line.trim().startsWith('-')) {
              const content = line.replace('-', '').trim();
              if (currentCategory === 'stress') {
                lifestylePlan.mentalHealth.stressManagement.push(content);
              } else if (currentCategory === 'resources') {
                lifestylePlan.mentalHealth.resources.push(content);
              }
            }
          }
        } else if (section.startsWith('Diet Plan')) {
          const lines = section.split('\n').filter(line => line.trim());
          let currentCategory = '';

          for (let line of lines) {
            if (line.includes('*Recommended Foods:*')) {
              currentCategory = 'recommended';
            } else if (line.includes('*Foods to Avoid:*')) {
              currentCategory = 'avoid';
            } else if (line.includes('*Sample Meal Plan:*')) {
              currentCategory = 'meal';
            } else if (line.includes('*Breakfast:*') && currentCategory === 'meal') {
              const content = line.trim();
              lifestylePlan.diet.mealPlan.push(content);
            } else if (line.includes('*Lunch:*') && currentCategory === 'meal') {
              const content = line.trim();
              lifestylePlan.diet.mealPlan.push(content);
            } else if (line.includes('*Dinner:*') && currentCategory === 'meal') {
              const content = line.trim();
              lifestylePlan.diet.mealPlan.push(content);
            } else if (line.includes('*Snacks:*') && currentCategory === 'meal') {
              const content = line.trim();
              lifestylePlan.diet.mealPlan.push(content);
            } else if (line.trim().startsWith('-')) {
              const content = line.replace('-', '').trim();
              if (currentCategory === 'recommended') {
                lifestylePlan.diet.recommendedFoods.push(content);
              } else if (currentCategory === 'avoid') {
                lifestylePlan.diet.foodsToAvoid.push(content);
              }
            }
          }
        }
      }

      setSuggestions(lifestylePlan);
    } catch (error) {
      console.error('Error parsing structured data:', error);
      setError('Failed to process lifestyle recommendations');
    }
  };

  return (
    <div className="lifestyle-container">
      <div className="lifestyle-header">
        <h2>Lifestyle Recommendations</h2>
        <p>Personalized health suggestions based on your medical profile</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <FaSpinner className="spinner-icon" />
          <p>Loading your personalized recommendations...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>Error: {error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
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
            <h3>Personalized Health Recommendations</h3>

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
          <h3>No personalized recommendations available</h3>
          <p>We couldn't find any lifestyle recommendations for your profile. Please ensure your medical information is up to date.</p>
        </div>
      )}
    </div>
  );
};

export default LifestyleTab;