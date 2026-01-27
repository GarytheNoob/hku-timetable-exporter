# HKU Timetable Exporter

> [!NOTE]
> This project is under development and may not be fully functional yet.


This Chrome extension converts the HKU SIS timetable into an ICS file format 
that can be imported into calendar applications.

## Usage

1. Install the extension in your Chrome browser.

1. Enter your HKU Portal and go to `Timetable` -> `My weekly schedule` -> `List View` 
 -> choose your semester.

1. Click the extension icon in the toolbar and you shall see the menu.

1. Press `Capture` key to capture the timetable data.

1. Unbox the courses you do not want to export.

1. Press `Sync courses to calendar` to generate and download the ICS file.

## Build

To build the project, ensure you have Node.js installed, then run the following 
commands:

```bash
npm install
npm run build
```

## License
MIT
