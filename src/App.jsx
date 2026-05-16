import { useState } from 'react';
import RouteMap from './components/RouteMap';
import Dashboard from './components/Dashboard';
import axios from "axios";
import debounce from "lodash/debounce";
function App() {
  const [sourceText, setSourceText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [showIntro,setShowIntro] = useState(true);
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] =
  useState([]);
  const [travelMode, setTravelMode] =
  useState("driving");
  const [suggestions, setSuggestions] =
  useState([]);
  const [
  weather,
  setWeather
] = useState(null);

const [
  destinationWeather,
  setDestinationWeather
] = useState(null);

const fetchWeather = async (
  lat,
  lng,
  type
) => {

  try {

    const response =
      await fetch(

      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric`

      );

    const data =
      await response.json();

    if (type === "source") {

      setWeather(data);

    }

    else {

      setDestinationWeather(data);

    }

  }

  catch (error) {

    console.log(
      "Weather Error",
      error
    );

  }

};

const [chatInput, setChatInput] =
  useState("");

const [chats, setChats] =
  useState([]);

const [aiLoading, setAiLoading] =
  useState(false);

const askTrafficAI = async () => {

  if (!chatInput.trim()) return;

  const userMessage = {

    sender: "user",

    text: chatInput

  };

  setChats((prev) => [

    ...prev,

    userMessage

  ]);

  setAiLoading(true);

  const currentQuestion =
    chatInput;

  setChatInput("");

  try {

    const response =
  await axios.post(

  "https://api.groq.com/openai/v1/chat/completions",

  {

    model:
      "llama-3.3-70b-versatile",

    messages: [

      {

        role: "system",

        content:
          "You are a smart traffic assistant."

      },

      {

        role: "user",

        content:
          currentQuestion

      }

    ]

  },

  {

    headers: {

      Authorization:
        `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,

      "Content-Type":
        "application/json"

    }

  }

);

    const aiText =

      response.data
      .choices[0]
      .message
      .content;

    setChats((prev) => [

      ...prev,

      {

        sender: "ai",

        text: aiText

      }

    ]);

  }

  catch (error) {

  console.log("FULL ERROR:", error);

  console.log(
    "RESPONSE:",
    error.response
  );

  console.log(
    "DATA:",
    error.response?.data
  );

  alert(
    JSON.stringify(
      error.response?.data
    )
  );

  setChats((prev) => [

    ...prev,

    {

      sender: "ai",

      text:
        "⚠️ AI unavailable currently."

    }

  ]);

}

  setAiLoading(false);

  console.log(
  import.meta.env.VITE_GROQ_API_KEY
);

};

const trafficQuiz = [

  {
    question:
      "What signal color means STOP?",

    answer: "red"
  },

  {
    question:
      "What should riders wear while riding bike?",

    answer: "helmet"
  },

  {
    question:
      "Is mobile usage allowed while driving?",

    answer: "no"
  },

  {
    question:
      "What should you wear in car for safety?",

    answer: "seat belt"
  },

  {
    question:
      "Should you follow speed limits?",

    answer: "yes"
  },

  {
    question:
      "Can you drive after drinking alcohol?",

    answer: "no"
  },

  {
    question:
      "What does yellow signal indicate?",

    answer: "wait"
  },

  {
    question:
      "Which side should vehicles drive in India?",

    answer: "left"
  },

  {
    question:
      "Should pedestrians use zebra crossing?",

    answer: "yes"
  },

  {
    question:
      "What should you do before turning?",

    answer: "indicator"
  }

];

const [
  currentQuestion,
  setCurrentQuestion
] = useState(0);

const [
  userAnswer,
  setUserAnswer
] = useState("");

const [
  quizResult,
  setQuizResult
] = useState("");

const [
  score,
  setScore
] = useState(0);

const checkQuizAnswer = () => {

  const correctAnswer =

    trafficQuiz[
      currentQuestion
    ].answer;

  if (

    userAnswer
      .toLowerCase()
      .trim()

    ===

    correctAnswer
      .toLowerCase()

  ) {

    setQuizResult(
      "✅ Correct Answer"
    );

    setScore(score + 1);

  }

  else {

    setQuizResult(

      `❌ Wrong Answer.
Correct Answer:
${correctAnswer}`

    );

  }

  setTimeout(() => {

    setQuizResult("");

    setUserAnswer("");

    if (

      currentQuestion
      <

      trafficQuiz.length - 1

    ) {

      setCurrentQuestion(
        currentQuestion + 1
      );

    }

    else {

      setCurrentQuestion(0);

    }

  }, 2000);

};

const delayedSearch = debounce(
  (value) => {

    searchPlaces(value);

  },
  500
);

const delayedDestinationSearch = debounce(

  (value) => {

    searchDestinationPlaces(value);

  },

  500

);

  const [
  destinationSuggestions,
  setDestinationSuggestions
] = useState([]);
const [
  smartSuggestion,
  setSmartSuggestion
] = useState("");
  const [menuOpen, setMenuOpen] =
  useState(false);
  const [activeSection, setActiveSection] =
useState("home");
const [distance, setDistance] = useState(0);
const [time, setTime] = useState(0);
  const [places, setPlaces] = useState([]);
  const [
  showLanding,
  setShowLanding
] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
const startVoiceInput = () => {

  if (!window.webkitSpeechRecognition) {

    alert("Voice recognition not supported");

    return;
  }

  const recognition =
    new window.webkitSpeechRecognition();

  recognition.lang = "en-IN";

  recognition.start();

  recognition.onresult = (event) => {

    const speechText =
      event.results[0][0].transcript;

    setSourceText(speechText);
  };
};

const startDestinationVoice = () => {

  if (!window.webkitSpeechRecognition) {

    alert("Voice recognition not supported");

    return;
  }

  const recognition =
    new window.webkitSpeechRecognition();

  recognition.lang = "en-IN";

  recognition.start();

  recognition.onresult = (event) => {

    const speechText =
      event.results[0][0].transcript;

    setDestinationText(speechText);
  };
};

  const getCoordinates = async (place) => {

  try {

    if (!place) return null;

    // CLEAN EXTRA TEXT
    const cleanPlace = place
      .replace(/\bIndia\b/gi, "")
      .trim();

    const response = await fetch(

      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(cleanPlace)}`,

      {
        headers: {
          Accept: "application/json"
        }
      }

    );

    const data = await response.json();

    console.log("Location Data:", data);

    if (data && data.length > 0) {

      return {

        lat: parseFloat(data[0].lat),

        lng: parseFloat(data[0].lon)

      };

    }

    return null;

  }

  catch (error) {

    console.log("Location Error:", error);

    return null;

  }

};

const fetchNearbyPlaces = async (lat, lng) => {

  const query = `
    [out:json];
    (
      node["amenity"="hospital"](around:5000,${lat},${lng});
      node["amenity"="fuel"](around:5000,${lat},${lng});
      node["amenity"="parking"](around:5000,${lat},${lng});
    );
    out;
  `;

  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      body: query
    }
  );

  const data = await response.json();

  setPlaces(data.elements);
};
  
  const searchPlaces = async (query) => {

  if (!query || query.length < 3) {

    setSuggestions([]);

    return;

  }

  try {

    const response = await fetch(

      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,

      {

        headers: {

          "Accept": "application/json",

          "User-Agent":
            "smart-traffic-tracker"

        }

      }

    );

    const data = await response.json();

    setSuggestions(data);

  }

  catch (error) {

    console.log(error);

  }

};

const searchDestinationPlaces = async (query) => {

  if (!query || query.length < 3) {

    setDestinationSuggestions([]);

    return;

  }

  try {

    const response = await fetch(

      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,

      {

        headers: {

          "Accept": "application/json",

          "User-Agent":
            "smart-traffic-tracker"

        }

      }

    );

    const data = await response.json();

    setDestinationSuggestions(data);

  }

  catch (error) {

    console.log(error);

  }

};

const [
  loading,
  setLoading
] = useState(false);


const speakRoute = () => {

  const speech =
    new SpeechSynthesisUtterance(

      `Your route from
      ${sourceText}
      to
      ${destinationText}
      is ready.

      Distance is
      ${distance}
      kilometers.

      Estimated time is
      ${time}
      minutes.

      Traffic is
      ${trafficLevel}`

    );

  speech.rate = 1;

  speech.pitch = 1;

  window.speechSynthesis.speak(speech);

};
 const handleRoute = async () => {

  try {

    setLoading(true);

    /* GET SOURCE */

    const sourceCoords =
      await getCoordinates(
        sourceText
      );

    /* GET DESTINATION */

    const destinationCoords =
      await getCoordinates(
        destinationText
      );

    /* CHECK */

    if (
      !sourceCoords ||
      !destinationCoords
    ) {

      alert(
        "Location not found"
      );

      setLoading(false);

      return;

    }

    /* SET MAP */

    setSource(sourceCoords);

    setDestination(
      destinationCoords
    );

setActiveSection("traffic");

    /* FETCH WEATHER */

fetchWeather(
  sourceCoords.lat,
  sourceCoords.lng,
  "source"
);

fetchWeather(
  destinationCoords.lat,
  destinationCoords.lng,
  "destination"
);

    /* SAVE HISTORY */

    setHistory((prev) => [

      ...prev,

      {

        source: sourceText,

        destination:
          destinationText

      }

    ]);

    /* FETCH SERVICES */

    fetchNearbyPlaces(

      sourceCoords.lat,

      sourceCoords.lng

    );

  }

  catch (error) {

    console.log(error);

    alert(
      "Failed to load route"
    );

  }

  finally {

    setLoading(false);

  }

};
const currentTime =
  new Date().toLocaleTimeString();
  const fuelPrice = 105;

const mileage = 15;

const fuelCost = distance
  ? ((Number(distance) / mileage) * fuelPrice).toFixed(0)
  : 0;

  let trafficLevel = "";
  let trafficColor = "";

  if (Number(time) < 120) {
    trafficLevel = "Low Traffic";
    trafficColor = "green";
  }
  else if (Number(time) < 300) {
    trafficLevel = "Medium Traffic";
    trafficColor = "orange";
  }
  else {
    trafficLevel = "Heavy Traffic";
    trafficColor = "red";
  }


  
  return (

  <div
  className={`app-layout ${
    darkMode
      ? "dark-theme"
      : "light-theme"
  }`}
>

    {/* SIDEBAR */}


  <div className="sidebar">

    {/* Close Button */}
    {/* Logo */}
    <h2 className="sidebar-logo">
      Smart Traffic Tracker
    </h2>
    <div
  id="google_translate_element"
  className="translate-box"
></div>
    {/* Menu Items */}

<button
  className="theme-btn"
  onClick={() =>
    setDarkMode(!darkMode)
  }
>

  {darkMode
    ? "☀️ Light Mode"
    : "🌙 Dark Mode"}

</button>

    <div className="sidebar-menu">

      <p
        onClick={() => {
          setActiveSection("home");
          setMenuOpen(false);
        }}
      >
        🏠 Home
      </p>

      <p
        onClick={() => {
          setActiveSection("traffic");
          setMenuOpen(false);
        }}
      >
        🗺️ Traffic Map
      </p>

      <p
        onClick={() => {
          setActiveSection("dashboard");
          setMenuOpen(false);
        }}
      >
        📊 Dashboard
      </p>

      <p
        onClick={() => {
          setActiveSection("services");
          setMenuOpen(false);
        }}
      >
        📍 Nearby Services
      </p>

     <p
  onClick={() =>
    setActiveSection(
      "trafficRules"
    )
  }
>

  🚦 Traffic Rules

</p>
    </div>
  </div>




<div className="main-content">

{showIntro && (
  <div className="intro-section">

    <div className="intro-overlay"></div>

    <div className="intro-left">

      <h1>Smart Traffic Tracker</h1>

      <h2>Better Journeys.</h2>

      <p>
        Get real-time traffic updates, find the best routes,
        and reach your destination faster and safer.
      </p>

      <button
        className="start-btn"
        onClick={() => {

          setShowIntro(false);

          setActiveSection("home");

          setTimeout(() => {

            const section =
              document.getElementById("hero-section");

            if (section) {

              section.scrollIntoView({
                behavior: "smooth",
              });

            }

          }, 100);

        }}
      >
        Get Started
      </button>

    </div>

  </div>
)}



    {!showIntro &&
 activeSection === "home" && (
<div className="hero-section"
 id="hero-section">
  <div className='bottom-info-section'>
        <h1>Track Smart Routes Across India</h1>
        
        <div className="controls">

  {/* SOURCE */}

  {/* SOURCE */}

<div className="input-row">

  <input
    type="text"
    placeholder="Enter Source"
    value={sourceText}
    onChange={(e) => {

      setSourceText(e.target.value);

      delayedSearch(e.target.value);

    }}
  />

  <button onClick={startVoiceInput}>
    🎙️ Speak Source
  </button>

</div>

{/* SOURCE SUGGESTIONS */}

{suggestions.length > 0 && (

  <div className="suggestions-box">

    {suggestions
      .slice(0, 5)
      .map((item, index) => (

      <p
        key={index}

        onClick={() => {

          setSourceText(
            item.display_name
          );

          setSuggestions([]);

        }}
      >

        {item.display_name}

      </p>

    ))}

  </div>

)}

  {/* DESTINATION */}

 {/* DESTINATION */}

<div className="input-row">

  <input
    type="text"
    placeholder="Enter Destination"
    value={destinationText}
    onChange={(e) => {

      setDestinationText(
        e.target.value
      );
delayedDestinationSearch(
  e.target.value
);

    }}
  />

  <button onClick={startDestinationVoice}>
    🎙️ Speak Destination
  </button>

</div>

{/* DESTINATION SUGGESTIONS */}

{destinationSuggestions.length > 0 && (

  <div className="suggestions-box">

    {destinationSuggestions
      .slice(0, 5)
      .map((item, index) => (

      <p
        key={index}

        onClick={() => {

          setDestinationText(
            item.display_name
          );

          setDestinationSuggestions([]);

        }}
      >

        {item.display_name}

      </p>

    ))}

  </div>

)}

  {/* ROUTE BUTTONS */}

  <div className="input-row">

    <select
      onChange={(e) =>
        setTravelMode(
          e.target.value
        )
      }
    >

      <option value="driving">
        🚗 Driving
      </option>

      <option value="walking">
        🚶🏻 Walking
      </option>

      <option value="cycling">
        🚲 Cycling
      </option>

    </select>

    <button onClick={handleRoute}>
      Find Route
    </button>

  </div>

  {/* BELOW ITEMS TOP TO BOTTOM */}

  <button onClick={speakRoute}>
    🔊 Voice Navigation
  </button>

  <button
    onClick={() => {

      setFavorites([
        ...favorites,

        {
          source: sourceText,
          destination:
            destinationText
        }

      ]);

    }}
  >

    ⭐ Save Route

  </button>

</div>

<div className="route-details">
        <h3>Route Details</h3>

        <p>Distance: {distance} km</p>

        <p>Estimated Time: {time} minutes</p>
        <p>
  Estimated Fuel Cost: ₹{fuelCost}
</p>
        <p style={{ color: trafficColor }}>
          Traffic Status: {trafficLevel}
        </p>
      </div>

<div className="favorites-section">

  <h2>⭐ Favorite Routes</h2>

  {favorites.length === 0 ? (

    <p>No favorite routes yet</p>

  ) : (

    favorites.map((item, index) => (

      <div
        key={index}
        className="place-item"
      >

        <p>
          {item.source}
          →
          {item.destination}
        </p>

      </div>

    ))

  )}

</div>

<div className="recent-searches">
          
         
          
  <h2>Recent Searches</h2>
<button onClick={() => setHistory([])}>
  Clear History
</button>
  {history.map((item, index) => (

    <div
      key={index}
      className="place-item"
    >

      <p>
        {item.source} → {item.destination}
      </p>

    </div>

  ))}

</div>

      <div className='emergency-box'>

  <button>
    🚨 Emergency SOS
  </button>

</div>
</div>



      </div>
      
     )}
   
    {activeSection ===
  "trafficRules" && (

  <div className="rules-section">

    <h1>
      🚦 Traffic Rules
    </h1>

    <div className="rules-container">

      <div className="rule-card">

        <h3>
          🛑 Stop at Red Light
        </h3>

        <p>
          Always stop when
          signal is red.
        </p>

      </div>

      <div className="rule-card">

        <h3>
          🚗 Wear Seat Belt
        </h3>

        <p>
          Seat belts are
          mandatory for
          driver and passengers.
        </p>

      </div>

      <div className="rule-card">

        <h3>
          🪖 Wear Helmet
        </h3>

        <p>
          Two-wheeler riders
          must wear helmets.
        </p>

      </div>

      <div className="rule-card">

        <h3>
          📵 Avoid Mobile Usage
        </h3>

        <p>
          Do not use mobile
          phones while driving.
        </p>

      </div>

      <div className="rule-card">

        <h3>
          🚦 Follow Speed Limits
        </h3>

        <p>
          Maintain speed
          according to road
          regulations.
        </p>

      </div>

      <div className="rule-card">

        <h3>
          🍺 No Drunk Driving
        </h3>

        <p>
          Never drive after
          consuming alcohol.
        </p>

      </div>

{/* DRIVING TIPS */}

<div className="tips-section">

  <h2>
    🚗 Smart Driving Tips
  </h2>

  <div className="tip-card">

    Maintain safe distance
    between vehicles.

  </div>

  <div className="tip-card">

    Avoid sudden lane changes.

  </div>

  <div className="tip-card">

    Use indicators before turning.

  </div>

  <div className="tip-card">

    Slow down during rain.

  </div>

</div>

{/* ROAD SIGNS */}

<div className="signs-section">

  <h2>
    🚦 Road Signs
  </h2>

  <div className="sign-card">
    🛑 Stop
  </div>

  <div className="sign-card">
    ⚠️ Warning
  </div>

  <div className="sign-card">
    🚸 School Zone
  </div>

  <div className="sign-card">
    🚫 No Entry
  </div>

</div>

{/* TRAFFIC FINES */}

<div className="fines-section">

  <h2>
    💰 Traffic Fines
  </h2>

  <div className="fine-card">

    🚗 No Seat Belt
    → ₹1000

  </div>

  <div className="fine-card">

    📵 Mobile While Driving
    → ₹5000

  </div>

  <div className="fine-card">

    🍺 Drunk Driving
    → ₹10000

  </div>

  <div className="fine-card">

    🪖 No Helmet
    → ₹1000

  </div>

</div>

{/* QUIZ */}

<div className="quiz-section">

  <h2>
    🧠 Traffic Quiz
  </h2>

  <h3>

    Question
    {currentQuestion + 1}

  </h3>

  <p>

    {
      trafficQuiz[
        currentQuestion
      ].question
    }

  </p>

  <input

    type="text"

    placeholder="Type answer"

    value={userAnswer}

    onChange={(e) =>

      setUserAnswer(
        e.target.value
      )

    }

  />

  <button
    onClick={checkQuizAnswer}
  >

    Submit Answer

  </button>

  <p className="quiz-result">

    {quizResult}

  </p>

  <h3>

    ⭐ Score:
    {score}

  </h3>

</div>

    </div>

  </div>

)}

      {loading && (
  <h2 style={{ textAlign: "center" }}>
    Loading Route...
  </h2>
)}
{activeSection === "traffic" && (

<div id="traffic-map">

  {source && destination && (

<RouteMap
  source={source}
  destination={destination}
  travelMode={travelMode}
  setDistance={setDistance}
  setTime={setTime}
  setSmartSuggestion={setSmartSuggestion}
/>

)}

  {/* SMART SUGGESTIONS */}

  <div className="smart-suggestion">

    <h2>
      🚀 Smart Suggestions
    </h2>

    <p>
      {smartSuggestion}
    </p>

  </div>

  <div className="weather-section">

  <h2>
    🌦️ Weather Information
  </h2>

  {/* SOURCE WEATHER */}

  {weather && (

    <div className="weather-card">

      <h3>
        📍 Source Location
      </h3>

      <p>
        Temperature:
        {weather?.main?.temp}°C
      </p>

      <p>
        Condition:
        {weather.weather[0].description}
      </p>

      <p>
        Humidity:
        {weather.main.humidity}%
      </p>

      <p>
        Wind Speed:
        {weather.wind.speed} m/s
      </p>

    </div>

  )}

  {/* DESTINATION WEATHER */}

  {destinationWeather && (

    <div className="weather-card">

      <h3>
        🎯 Destination Location
      </h3>

      <p>
        Temperature:
        {destinationWeather.main.temp}°C
      </p>

      <p>
        Condition:
        {
          destinationWeather
          .weather[0]
          .description
        }
      </p>

      <p>
        Humidity:
        {
          destinationWeather
          .main.humidity
        }%
      </p>

      <p>
        Wind Speed:
        {
          destinationWeather
          .wind.speed
        } m/s
      </p>

    </div>

  )}

</div>

{/* AI CHATBOT */}

  <div className="chatbot-section">

    <h1>
      🤖 AI Traffic Assistant
    </h1>

    <div className="chat-container">

      {chats.map(
        (chat, index) => (

        <div

          key={index}

          className={

            chat.sender === "user"

            ? "user-chat"

            : "ai-chat"

          }

        >

          {chat.text}

        </div>

      ))}

    </div>

    <div className="chat-input-area">

      <input

        type="text"

        placeholder="Ask traffic questions..."

        value={chatInput}

        onChange={(e) =>

          setChatInput(
            e.target.value
          )

        }

        onKeyDown={(e) => {

          if (e.key === "Enter") {

            askTrafficAI();

          }

        }}

      />

      <button
        onClick={askTrafficAI}
      >

        {aiLoading
          ? "Thinking..."
          : "Send"}

      </button>

    </div>

  </div>

</div>
)}
  

      {activeSection === "dashboard" && (

<div id="dashboard">
  <Dashboard />

</div>
      )}

{activeSection === "services" && (

<div className="places-box">
  <h2>Nearby Services</h2>

  {places.map((place, index) => (
    <div key={index} className="place-item">

      <p>
        {place.tags.name || "Unnamed Place"}
      </p>

      <p>
        Type: {place.tags.amenity}
      </p>

    </div>
  ))}

</div>
)}
    </div>
</div>
  );
}

export default App;