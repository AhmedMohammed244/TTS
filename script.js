// Fetch voices and send to combobox
async function fetchVoices() {
    const voiceSelect = document.getElementById("voiceSelect");

    try {
        const response = await fetch("http://127.0.0.1:5000/api/voices");
        const voices = await response.json();

        voiceSelect.innerHTML = '<option value="" disabled selected>Select a voice</option>';
        voices.forEach(voice => {
            const option = document.createElement("option");
            option.value = voice.voice_id;
            option.textContent = voice.name;
            voiceSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching voices:", error);
        voiceSelect.innerHTML = '<option disabled>Error loading voices</option>';
    }
}

// Convert text to speech
async function convertTextToSpeech() {
    const text = document.getElementById("text").value;
    const voiceId = document.getElementById("voiceSelect").value;
    const progressBar = document.getElementById("progressBar");
    const progressContainer = document.querySelector(".progress-container");
    const progressText = document.getElementById("progressText");
    const audioPlayer = document.getElementById("audioPlayer");

    console.log("Text:", text);  
    console.log("Voice ID:", voiceId); 

    if (!text || !voiceId) {
        alert("Please enter text and select a voice.");
        return;
    }

    progressContainer.style.display = "flex";
    progressBar.value = 0;
    progressText.textContent = "0%";

    // Simulate progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        progressBar.value = progress;
        progressText.textContent = `${progress}%`;
        if (progress >= 90) {
            clearInterval(interval);
        }
    }, 500);

    try {
        const response = await fetch("http://127.0.0.1:5000/api/text-to-speech", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, voice_id: voiceId })
        });

        if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            audioPlayer.src = audioUrl;
            audioPlayer.style.display = "block";
            progressBar.value = 100;
            progressText.textContent = "100%";

            // Clear the interval to prevent further updates
            clearInterval(interval);
        } else {
            alert("Failed to convert text to speech.");
        }
    } catch (error) {
        console.error("Error converting text:", error);
        alert("An error occurred. Check the console for details.");
        // Ensure the interval is cleared in case of an error
        clearInterval(interval);
    }
}


// Event Listeners
document.addEventListener("DOMContentLoaded", fetchVoices);
document.getElementById("convertButton").addEventListener("click", convertTextToSpeech);
