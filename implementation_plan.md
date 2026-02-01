# Implementation Plan - Auto-Scroll and State Update

Update `EmergencyAccessTab` to match specific variable names and behavior requested.

## Proposed Changes
#### [MODIFY] [EmergencyAccessTab.tsx](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/components/EmergencyAccessTab.tsx)
- **State**: Rename `activeEmergencyId` to `activeId`.
- **Ref**: Add `const responseSheetRef = useRef<HTMLDivElement>(null);`
- **Logic**: 
  - Update `handleEmergency` success block:
    - Parse `data` as array (or handle both for robustness, but prioritize `data[0].id` as requested).
    - `setActiveId(data[0].id)`.
    - `setTimeout(() => responseSheetRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);` to ensure render happens first.
- **JSX**: 
  - Update `EmergencyResponseSheet` prop: `emergencyId={activeId}`.
  - Wrap it in a div with the ref for scrolling target.

## Verification
- Verify variable `activeId` is used.
- Verify parsing logic matches `data[0].id`.
- Verify scroll occurs after "Success".
