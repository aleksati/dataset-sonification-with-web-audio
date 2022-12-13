# Workshop in Creative Data Visualization and Sonification in the Browser

1. [Introduction](#intro)
2. [Learning outcomes](#learning-outcomes)
3. [Requirements](#requirements)
4. [Setup](#setup)

   4.1. [Browser](#browser-recommended)

   4.2. [Local](#local)

5. [Organizers](#organizers)

## Intro

Learn how to display multidimensional data using dynamic images and sound in the browser. In collaboration with the Digital Scholarship Days at the University of Oslo.

<div align="left">
 <img src="/fig/dsc-days.png" width=600>
</div>
</br>

We will explore the use of visuals and sound in a creative way while still preserving coherence with the data bring rendered. Sonification refers to the use of non-speech audio to convey information or perceptualize data. Using the browser as a display tool drastically simplifies dissemination with peers and communication with the general public. As a bonus, we will show you how to embed this in your UiO personal page.

For location and additional information, visit the [official event page](https://www.ub.uio.no/english/courses-events/events/all-libraries/2023/digital-scholarship-days/data-visualization.html).

## Learning outcomes

- Learn easy-to-use Javascript libraries for dynamic visualization and sonification.
- Learn to creatively map pre-recorded or real-time data and to sound and visuals.
- Learn to integrate data visualization and sonification in a web page.

## Requirements

- Familiarity with any text-based programming language (e.g., if/else statements, loops, arrays, functions, etc.). In the workshop, we will write Javascript code. The workshop is for people interested in data sonification and/or creating computing, wheter it be PhDs, postdocs, other technical personnel and/or students.

- Laptop with a [chromium browser](<https://en.wikipedia.org/wiki/Chromium_(web_browser)>)

## Setup

The workshop materials requires a minimal setup. You can work from the browser via p5 own web editor or directly from your local machine using a text editor like Visual Studio Code.

### Browser (recommended)

To follow the workshop from your browser, you can follow these steps:

1. Create an account on the [p5.js Web Editor](https://editor.p5js.org/).

2. Go to "My Sketches" and create a new sketch. This will be our project folder for the workshop.

<div align="left">
 <img src="/fig/browser-1-mysketches.jpg" width=600>
</div>
</br>

3. In the web editor of your new sketch, open the sidebar to access your files.

<div align="left">
 <img src="/fig/browser-1-sidebar.jpg" width=600>
</div>
</br>

4. Via the small dropdown menu, upload data and create folders.

<div align="left">
 <img src="/fig/browser-2-upload-files.jpg" width=600>
</div>
</br>

### Local

If you prefer to work with coding locally, e.g with files on your machine instead of in the browser, you can follow these steps to setup a local environment with the Visual Studio Code text editor.

1. Download [Visual Studio Code](https://code.visualstudio.com/download).

2. Download a template sketch from the p5 web editor.

<div align="left">
 <img src="/fig/local-1-download.png" width=600>
</div>
</br>

3. Unzip the downloaded contents. Inside the folder, you will find your index.html and sketch file together with other p5 library files that enable you to work with p5 locally, such as the "p5.sound.min" (important for anything audio-related).

<div align="left">
 <img src="/fig/local-2-downloaded-content.png" width=600>
</div>
</br>

4. Import the folder into Visual Studio Code.

<div align="left">
 <img src="/fig/local-3-vsc.png" width=600>
</div>
</br>

4.1. **(optional)** In your index.html file, change the path/url in the `<script>` tags from `src="https://cdnjs.cloudflare.com/ajax/libs..."` to point to your local p5 library files.

<div align="left">
 <img src="/fig/local-4.1-script.jpg" width=600>
</div>
</br>

5. Download the "Live Server" Extenstion in Visual Studio Code.

<div align="left">
 <img src="/fig/local-4-liveserver.png" width=600>
</div>
</br>

6. Right-click on the "index.html" file and select "open with Live Server".

<div align="left">
 <img src="/fig/local-5-serve.png" width=600>
</div>
</br>

7. Open your chromium browser on localhost address `127.0.0.1/5500`

<div align="left">
 <img src="/fig/local-6-start.png" width=600>
</div>
</br>

## Organizers

[Stefano Fasciani](https://github.com/stefanofasciani) and Aleksander Tidemann
