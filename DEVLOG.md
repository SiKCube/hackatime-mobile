# Here is the DEV LOG

## Auth Context 
**(Sept 9 2026)**

Once the Auth flow works with **Hackatime Oauth** using `expo-auth-session`. I put it on a context with his states and functions, this way is more easy to use it on other future parts of the app. This `auth-ctx` also saves the token and apikey of the user after login. Also an logger component to debug to context on the phone.

This took me a long time, because my **dev build died**, it was freezing and when I run the dev server died. So I was tring to figure out what happend, I litearly didn't change anything.

First I tried to install an older dev build, the same bug. Then I tried to make another build without cache enable, same bug. Then I tried using Expo go, exploted. At the end I deleted the `node_modules`, roll-back the `package.json` and `pnpm-lock.yaml`, and then re-install all the packages. The cause of the bug it was all the "future" packages I installed, because I use the dev build on my phone (my laptop doesn't lives if I run vscode and an android phone emulator), so to make just one dev build and save time, I installed all the libraries I tought I'll use. It appears, also I downgraded expo.

Remember to only install libraries that you need. 

## Tabs added and charts lib added
**(Sept 10 2026)**

While doing the dev build with the new libraries added, I found that my EAS free trial was full, so I tried to make the build on my toaster, it didn' work, so I change my user to have 15 more cloud builds. 

Here the idea of the app is cooking, a stats viewer, a streak panel, a Hackclub programs viewer with calculator and a integration with Hackclub mail.
