# Configure Chatbot to use a separate Supabase project

The user wants the chatbot to use a dedicated Supabase project (URL: `https://ymcejzgkvlxepjaihqzs.supabase.co`) while the rest of the app continues to use the main project.

## User Review Required

- **Hardcoded Credentials**: I will strictly hardcode the provided URL and Anon Key into `ChatInterface.tsx` as requested. This is generally not recommended for production but fulfills the specific request "do not alter .env".

## Proposed Changes

### Components

#### [MODIFY] [src/components/ChatInterface.tsx](file:///c:/College/hackathons/SehatSaathi/remote-well-reach/src/components/ChatInterface.tsx)
- Import `createClient` from `@supabase/supabase-js`.
- Create a specific `chatSupabase` client instance using the provided credentials.
- Update `handleSend` to use `chatSupabase.functions.invoke` instead of the global `supabase` client.

## Verification Plan

### Manual Verification
- I will verify the code changes ensure only `ChatInterface` uses the new client.
- The user will need to test the chatbot. The previous 404 error should be resolved if the edge function is deployed on *this* new project.
