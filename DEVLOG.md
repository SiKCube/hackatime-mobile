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

## Added basic stats charts
**(14 Sept 2026)**

Hi, so this took me a while cause i was looking the api docs and a way to put it to all graphs like on the original hackatime dashboard. I was testing, the basic charts work, exepct the editor chart, os chart and Coding Rhythm, why? Because the first 2 (editor and os) the api doesn't support it, but in the docs says it does, hmmm. Then the coding Coding Rhythm, is the coolest of all, and useful (in my opinion, bruh) but the libray `react-native-chart-kit` doesn't support that type of charts, it has a contribution heatmap, but it work for dates, not time, so I'll make my own chart like the ia vs human coding chart. Also the Projects timeline is slow has hell, idk how the hackatime fetches the data so fast (maybe having a specificy api endpoit would be cool), i fetch the data from `https://hackatime.hackclub.com/api/v1/users/{username}/projects/details` per x time inteval (day, weeks, months), the I filter that to the chart, this is slow. (a year has 365 days, 12 months, 52 weeks, thats a lot) And I realized that I could do that 1 time and use that data for all other charts. So now I'll make a Context that caches that, and serves it to the other charts. 

This commit is the testing, is making the bases for the next one. There is a way to update your API docs? And how I get my os and editor data?
