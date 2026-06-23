# Script Modules

The application still runs as ordered classic browser scripts. Keep the order in
`index.html` because modules share the existing global state.

- `00-dom-state.js`: DOM references and shared mutable state.
- `01-data-store.js`: mock data, default records, local storage helpers.
- `10-schedule.js`: schedule page, check-in cards, task panel helpers.
- `20-diet-sport-detail.js`: diet details and sport detail records.
- `30-medicine.js`: medicine check-in, records, detail, image preview.
- `40-checkin-forms.js`: sport, weight, waist, blood pressure, blood sugar forms.
- `50-reports-services.js`: medical reports, upload flow, services.
- `60-metrics.js`: metric recording and metric detail pages.
- `70-events-init.js`: event binding, page switching, initialization.
