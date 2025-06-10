# Issues found in the Components/Delivery code

## 1. Graphs/Delivery/PerformanceCard.tsx
- Hardcoded chart data and labels; not reusable for other datasets.
- No prop for passing dynamic chart data; tightly coupled to a specific use case.
- Uses "use client" for the entire component, even though only parts require client-side logic.
- Lacks clear separation of concerns; UI, data, and logic are mixed.
- No comments or documentation for maintainability.

## 2. Select/Delivery/Zul-Select.jsx
- Custom select implementation re-invents basic select logic instead of using a well-tested library.
- Lacks accessibility features (no ARIA attributes, keyboard navigation, or focus management).
- Uses internal state for value management, which can cause issues in controlled forms.
- Error handling is minimal and only visual.

## 3. Form-Images/Delivery/CreateListingsModal.tsx
- The images gallery is hardcoded and not reusable as a component; it cannot be easily used elsewhere in the app.
- No drag-and-drop (DnD) or sort functionality for images; users cannot reorder or organize images interactively.
- No drag-and-drop support for uploading images; users cannot drag files into the gallery to add them.
- No multi-select or bulk actions for images; users cannot select, delete, or manage multiple images at once.
- Lacks modularity and separation of concerns, making future maintenance and extension difficult.
- No accessibility features (e.g., ARIA labels, keyboard navigation) for the gallery UI.
- No comments or documentation for maintainability or developer onboarding.
