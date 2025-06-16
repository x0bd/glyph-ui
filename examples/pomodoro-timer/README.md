# Pomodoro Timer Example

This is a colorful, interactive Pomodoro timer built with GlyphUI. The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.

## Features

-   🎯 Focus and break timers with visual progress indicator
-   🎨 Light and dark theme support
-   ⚙️ Customizable work and break durations
-   📊 Session tracking statistics
-   🔔 Browser notifications support
-   🖌️ Modern, responsive UI design

## Implementation Details

This example demonstrates several GlyphUI features:

-   Functional components with hooks (`useState`, `useEffect`)
-   SVG icons as components
-   Event handling
-   Conditional rendering
-   Form handling
-   Browser API integration (Notifications API)
-   Dynamic styling

## How It Works

The timer alternates between work and break sessions. When a session ends, it automatically switches to the other type and increments the session counter. The progress bar at the bottom of the timer shows the elapsed time.

Users can:

-   Start/pause the timer
-   Reset the current session
-   Adjust work and break durations
-   Toggle between light and dark themes
-   Enable browser notifications for session changes

## Code Structure

-   `index.html` - Contains the HTML structure and CSS styles
-   `timer.js` - Contains the GlyphUI application code and components

## Learning Points

This example showcases:

1. State management for timer functionality
2. Side effects with cleanup (interval management)
3. Responsive design principles
4. Theme switching with CSS variables
5. SVG icon components
6. Form handling and validation
7. Browser notifications API integration
