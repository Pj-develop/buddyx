# BuddyX - Smart Voice Assistant for Professionals

A mobile application designed to help professionals capture action items, meeting details, and key discussion points during conversations. The app records live audio, transcribes it in real time using Deepgram's API, and organizes the content into actionable tasks and meeting notes. The solution leverages Expo for rapid mobile development and Supabase for backend services.

- **App Walkthrough:**  
  [Video Demo - Main Actions](https://youtu.be/LLvJLa591pw)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Challenges Faced](#challenges-faced)
- [Technical Architecture](#technical-architecture)
- [System Architecture](#system-architecture)
- [Setup and Deployment](#setup-and-deployment)
- [Video Demonstrations](#video-demonstrations)
- [Guidelines and Further Information](#guidelines-and-further-information)
- [License](#license)

---

## Overview

The **BuddyX - Smart Voice Assistant for Professionals** aims to solve the problem of capturing actionable insights during meetings. It automatically records conversations, transcribes the audio using Deepgram's transcription service, and processes the transcript to extract tasks, calendar events, and summaries. The app uses Expo for the mobile frontend and Supabase as a backend solution, including edge functions that integrate with Deepgram.

---

## Features

- **Voice Processing:**  
  - Record audio conversations in real time.
  - Transcribe audio using Deepgram API.

- **Action Extraction & Generation:**  
  - Identify tasks, meeting details, and key discussion points.
  - Automatically generate calendar events, todo items, and meeting summaries.

- **User Interface:**  
  - Real-time transcription display with editing capabilities.
  - Intuitive and responsive design for seamless user experience on mobile devices.

- **Backend Integration:**  
  - Use Supabase for storage, edge functions, and database management.
  - Integrate with Deepgram for transcription.

---

## Challenges Faced

- **Real-Time Processing:**  
  Handling live audio transcription and ensuring minimal delay.

- **Accurate Action Extraction:**  
  Parsing transcribed text to accurately extract tasks and meeting details from varied conversation styles.

- **Resource Constraints:**  
  Managing resource limitations in serverless environments and optimizing the performance of transcription APIs.

- **Seamless Integration:**  
  Coordinating between the mobile frontend (Expo), backend storage (Supabase), and external transcription services (Deepgram).

---

## Technical Architecture

- **Frontend:**  
  - Developed with [Expo](https://expo.dev/) and React Native.
  - Provides a live transcription interface, controls for recording, and real-time feedback on processing status.

- **Backend:**  
  - **Supabase Storage:**  
    Audio files are uploaded to Supabase Storage for persistent hosting.
  - **Edge Functions:**  
    Custom edge functions in Supabase (written in TypeScript) are used to process and transcribe audio by integrating with the Deepgram API.
  - **Deepgram API:**  
    Processes the audio file and returns the transcription data.

---

## System Architecture

1. **Audio Recording:**  
   The mobile app records voice using Expo's `expo-av` module.

2. **File Upload:**  
   The recorded audio file is uploaded to Supabase Storage, which returns a public URL.

3. **Transcription Edge Function:**  
   The public URL is sent to a Supabase Edge Function, which:
   - Downloads the audio file.
   - Sends it to the Deepgram API for transcription.
   - Returns the transcription to the frontend.

4. **Action Extraction:**  
   The app analyzes the transcription to extract actionable insights (tasks, calendar events, summaries).

5. **User Interface:**  
   The transcription and extracted actions are displayed, allowing for further user editing and sharing.

---

## Setup and Deployment

### Prerequisites

- **Node.js** and **npm** installed on your development machine.
- **Expo CLI:** Install via `npm install -g expo-cli`.
- A Supabase project with Storage and Edge Functions enabled.
- A Deepgram API key set in your Supabase project environment variables (`DEEPGRAM_API_KEY`).

### Running the Mobile App

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Pj-develop/buddyx.git
   cd buddyx
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Expo Development Server:**
   ```bash
   expo start
   ```
   - Use the Expo Go app on your mobile device to scan the QR code and run the app.

### Deploying the Supabase Edge Function

1. **Navigate to the Functions Directory:**
   ```bash
   cd functions/transcribe
   ```

2. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy transcribe
   ```

3. **Edge Function URL:**  
   Once deployed, your function is accessible at:
   ```
   https://<your-project-ref>.functions.supabase.co/transcribe
   ```

4. **Configure Your Expo App:**  
   Update the API endpoint in your code to point to the deployed edge function URL.

---

## Video Demonstrations

- **App Walkthrough:**  
  [Video Demo - Main Actions](https://youtu.be/LLvJLa591pw)


---

## Guidelines and Further Information

- **Coding Guidelines:**  
  - Follow best practices for React Native and Expo.
  - Maintain clear separation between frontend and backend logic.
  - Ensure proper error handling and user feedback during recording and transcription.

- **Troubleshooting:**  
  - Check network permissions for audio recording on mobile devices.
  - Ensure environment variables (e.g., `DEEPGRAM_API_KEY`) are correctly configured in Supabase.

- **Documentation:**  
  For further details, refer to:
  - [Expo Documentation](https://docs.expo.dev/)
  - [Supabase Documentation](https://supabase.com/docs)
  - [Deepgram API Documentation](https://developers.deepgram.com/)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```

This README provides an overview of the project, details the challenges, explains the technical and system architectures, and includes guidelines on deployment using Expo and Supabase. Adjust the placeholders with your actual video links and repository details as needed.