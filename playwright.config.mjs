import {defineConfig} from '@playwright/test';

const baseURL = process.env.BASE_URL;
if (!baseURL) throw new Error('BASE_URL is required for Playwright smoke tests');

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['line'], ['html', {open:'never'}]] : 'line',
  use: {baseURL, trace:'retain-on-failure', screenshot:'only-on-failure'},
  projects: [
    {name:'desktop-1440', use:{viewport:{width:1440,height:900}}},
    {name:'desktop-1280', use:{viewport:{width:1280,height:720}}},
    {name:'tablet-1024', use:{viewport:{width:1024,height:768}}},
    {name:'mobile-390', use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true}}
  ]
});
