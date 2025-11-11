# FlowFix

FlowFix is a browser extension that provides instant grammar and spelling correction using Google's Gemini AI. Select text on any webpage, right-click, and get corrected text instantly.

## Features

- **Quick Grammar Correction**: Right-click on selected text to get instant corrections
- **AI-Powered**: Uses Google's Gemini 2.5 Flash model for accurate corrections
- **Works Everywhere**: Works on any webpage, including input fields and contenteditable elements
- **Easy to Use**: Simple context menu integration - no need to copy-paste

## Architecture

FlowFix consists of two main components:

1. **Backend Server (Python/Flask)**: A Flask API server that processes text correction requests using Gemini AI
2. **Browser Extension (Chrome)**: A Chrome extension that adds a context menu option for text correction

```
User selects text → Right-click → Extension sends to backend → Gemini AI corrects → Text replaced
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.10 or higher** - [Download Python](https://www.python.org/downloads/)
- **Google Chrome or Chromium-based browser** - For loading the extension
- **Google Gemini API Key** - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/flowfix-backend-python.git
cd flowfix-backend-python
```

### Step 2: Set Up Python Environment

Create a virtual environment (recommended):

```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Configure API Key

Create a `.env` file in the root directory:

```bash
# Windows
echo GEMINI_API_KEY=your_api_key_here > .env

# macOS/Linux
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

Replace `your_api_key_here` with your actual Gemini API key from Google AI Studio.

**Important**: Never commit your `.env` file to version control. It's already included in `.gitignore`.

### Step 5: Run the Backend Server

Start the Flask server:

```bash
python app.py
```

You should see output indicating the server is running on `http://127.0.0.1:5000`

Keep this terminal window open while using the extension.

## Loading the Browser Extension

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Alternatively, go to **Menu (⋮)** → **Extensions** → **Manage extensions**

### Step 2: Enable Developer Mode

1. Toggle the **Developer mode** switch in the top-right corner of the extensions page

### Step 3: Load the Extension

1. Click **Load unpacked**
2. Navigate to the `flowfix-extension` folder in this repository
3. Select the folder and click **Select Folder** (or **Open** on Windows)

### Step 4: Verify Installation

1. You should see the FlowFix extension appear in your extensions list
2. Click the extension icon in the toolbar to open the popup
3. Check if it shows "Server: Available" - this means the backend is running and reachable

## Usage

### Basic Usage

1. **Start the backend server** (if not already running):
   ```bash
   python app.py
   ```

2. **Select text** on any webpage that you want to correct

3. **Right-click** on the selected text

4. **Click "FlowFix: Correct grammar"** from the context menu

5. The selected text will be automatically replaced with the corrected version

### Supported Text Fields

FlowFix works with:
- Regular webpage text (select and replace)
- Input fields (`<input>`)
- Text areas (`<textarea>`)
- Contenteditable elements (rich text editors)

### Example

1. Type or select: `"This is a sentance with erors."`
2. Right-click → **FlowFix: Correct grammar**
3. Result: `"This is a sentence with errors."`

## Project Structure

```
flowfix-backend-python/
│
├── app.py                          # Flask backend server
├── requirements.txt                # Python dependencies
├── .env                           # API key configuration (create this)
├── README.md                      # This file
│
└── flowfix-extension/             # Chrome extension
    ├── manifest.json              # Extension configuration
    ├── background.js              # Extension service worker
    ├── popup.html                 # Extension popup UI
    ├── icon.png                   # Extension icon
    └── icons/                     # Extension icons (various sizes)
        ├── icon16.png
        ├── icon32.png
        ├── icon48.png
        └── icon128.png
```

## API Endpoint

The backend provides a single endpoint:

### POST `/correct`

Corrects grammar and spelling of provided text.

**Request:**
```json
{
  "text": "Text to correct here"
}
```

**Response:**
```json
{
  "corrected": "Corrected text here"
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Troubleshooting

### Extension shows "Server: Not reachable"

- Ensure the Flask server is running (`python app.py`)
- Check that the server is running on port 5000
- Verify no firewall is blocking localhost connections
- Try refreshing the extension popup

### API Key Errors

- Verify your `.env` file exists in the root directory
- Check that `GEMINI_API_KEY` is set correctly in `.env`
- Ensure your API key is valid and has quota available
- Restart the Flask server after changing `.env`

### Text Not Replacing

- Some websites may have restrictions that prevent text replacement
- Try using the extension on a different website
- Check the browser console (F12) for error messages
- Ensure you're selecting text in an editable field (for input/textarea)

### Port Already in Use

If port 5000 is already in use:

1. Find what's using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```

2. Either stop the process using port 5000, or modify `app.py` to use a different port:
   ```python
   app.run(host="0.0.0.0", port=5001)  # Change to different port
   ```

3. Update `manifest.json` in the extension to match:
   ```json
   "host_permissions": ["http://127.0.0.1:5001/*"]
   ```

4. Update `background.js` to use the new port:
   ```javascript
   fetch("http://127.0.0.1:5001/correct", ...)
   ```

## Development

### Running in Development Mode

For development with auto-reload:

```bash
# Install Flask development dependencies
pip install flask[dev]

# Run with debug mode
export FLASK_DEBUG=1  # macOS/Linux
set FLASK_DEBUG=1     # Windows
python app.py
```

### Testing the API

You can test the API directly using curl:

```bash
curl -X POST http://127.0.0.1:5000/correct \
  -H "Content-Type: application/json" \
  -d '{"text": "This is a test sentance with erors."}'
```

## Security Notes

- The backend server runs on `0.0.0.0:5000`, making it accessible from your local network
- For production use, consider adding authentication and rate limiting
- Never commit your `.env` file or API keys to version control
- The extension only communicates with `http://127.0.0.1:5000` for security

## Limitations

- Requires the backend server to be running for the extension to work
- Requires an active internet connection for Gemini AI API calls
- Some websites may prevent text replacement due to security policies
- API usage is subject to Google's Gemini API quotas and limits


## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Check that both the server and extension are properly configured

## Acknowledgments

- Built with [Flask](https://flask.palletsprojects.com/)
- Powered by [Google Gemini AI](https://ai.google.dev/)
- Chrome Extension API for browser integration

