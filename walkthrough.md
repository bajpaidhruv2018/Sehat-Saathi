# Emergency Access Updates - Walkthrough

I have added the `EmergencyAccessTab` and `EmergencyResponseSheet` components to the SehatSaathi application.

## Components

### 1. EmergencyAccessTab
- **Location**: `src/components/EmergencyAccessTab.tsx`
- **Function**: Allows users to trigger an emergency alert.
- **Key Features**:
  - **Patient Name (Required)**: User must enter a name before pushing the button.
  - Emergency Type Selection.
  - Message Input.
  - Integration with backend via webhook.
  - **Conditional Rendering**: The Response Sheet only appears *after* a successful emergency signal is sent.

### 2. EmergencyResponseSheet
- **Location**: `src/components/EmergencyResponseSheet.tsx`
- **Function**: Real-time display of hospital responses.
- **Key Features**:
  - Automatically appearing after emergency trigger (controlled by `activeEmergencyId`).
  - "Waiting" pulse animation when no responses.
  - Live polling (every 5s) for new updates from `hospital_responses`.
  - Color-coded badges for "BED AVAILABLE" (Green) vs "HOSPITAL FULL" (Red).

## Verification Steps

1. **Trigger Emergency**:
   - Go to Home page.
   - **Check Validation**: Verify "PUSH FOR EMERGENCY" is disabled initially.
   - **Enter Name**: Type a patient name. Button should enable (opacity change).
   - Select emergency type and click "PUSH FOR EMERGENCY".
   - Confirm the success alert.

2. **Observe Response Sheet**:
   - Only *after* the alert confirmation, the "Hospital Responses" section should appear.
   - It should show "Waiting for nearby hospitals..." with a pulse animation.
   - Note: The ID shown (or used internally) corresponds to the emergency created.

3. **Verify Responses (Mock/Real)**:
   - If the backend processes the request and adds rows to `hospital_responses` with the same `emergency_id`, they will appear in the list.
   - Responses show Hospital Name, Status Badge, Medical Advice, and Timestamp.

## Status Codes
- **BED AVAILABLE**: Green badge.
- **HOSPITAL FULL**: Red badge.
