# Dressup AI CLI Tool

This is a simple command-line interface (CLI) tool for dressing up a photo using Faceswapper AI API. With this tool, you can dress up a image with a prompt provided.

## Installation

To install the tool, follow these steps:

1. **Clone the repository (if applicable):**

   ```bash
   git clone https://github.com/thedr4c0/dressup.git
   cd dressup
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

To use the Dressup AI CLI tool, run the following command:

```bash
npm start "<prompt>" <image>
```

## How It Works

1. The tool sends prompt and image to the Faceswapper AI API.
2. The API processes the image and performs the changes.
3. The resulting image with the swapped face is saved in `data` directory.

## API Reference

This tool uses the Faceswapper AI API. For more details on the API and its capabilities, visit [Faceswapper AI](https://faceswapper.ai/).
