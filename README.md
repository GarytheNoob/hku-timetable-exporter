# HKU Timetable Exporter

This Chrome extension converts the HKU SIS timetable into an iCalendar (ICS) 
file that can be imported into calendar applications.

> [!IMPORTANT]
> This project is not affiliated with or endorsed by The University of Hong 
> Kong, and should be used at your own risk.

## Usage

### The extension

1. Install the extension in your Chrome browser.

1. Enter your HKU Portal and go to `Timetable` → `My weekly schedule` → `List View` 
 → choose your semester.

1. Click the extension icon in the toolbar and you shall see the menu.

1. Press `Capture` button to capture the timetable data.

1. Unbox the courses you do not want to export.

1. Press `Export Courses to Calendar` to generate and download the `.ics` file.

### Importing the ICS file

With the `.ics` file downloaded, you can import it into your calendar 
application.

<details>
<summary><b>Google Calendar</b></summary>

1. Visit [Google Calendar](https://calendar.google.com/), and log in to your 
   account.

1. On the left sidebar, click the `+` icon next to `Other calendars`.

1. Select `Import`.

1. Click `Select file from your computer` and choose the `.ics` file you 
   downloaded earlier.

1. Choose the calendar you want to import the events into, or create a new 
   calendar for the timetable.

1. Click `Import` to add the events to your calendar.
</details>

<details>
<summary><b>Apple Calendar (Mac)</b></summary>

1. Open the `Calendar` app on your Mac.

1. In the menu bar, click `File` and select `Import`.

1. Locate and select the `.ics` file you downloaded earlier, then click 
   `Import`.

1. Choose the calendar you want to add the events to, or create a new calendar.

1. Click `OK` to finish importing the events.
</details>

## Build

To build the project, ensure you have Node.js installed, then run the following 
commands:

```bash
npm install
npm run build
```

## License

MIT
