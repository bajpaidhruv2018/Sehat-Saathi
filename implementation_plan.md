# Update Workflow URLs

## Goal
Update the production URLs for the emergency request workflow and the hospital response workflow (if used).

## User Review Required
> [!IMPORTANT]
> I found the emergency request URL usages in `src/components/EmergencyAccessTab.tsx` and will update it.
> I did **not** find any direct usage of a "hospital response" webhook URL. The system uses Supabase Realtime for hospital responses.
> I will proceed with updating the emergency request URL only, unless instructed otherwise.

## Proposed Changes

### Frontend Components

#### [MODIFY] [EmergencyAccessTab.tsx](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/components/EmergencyAccessTab.tsx)
- Update code to use `https://n8n-qi63.onrender.com/webhook/emergency-trigger` instead of `http://localhost:5678/webhook/emergency-trigger`.

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure no build errors.
