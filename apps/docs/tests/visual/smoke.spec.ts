// apps/docs/tests/visual/smoke.spec.ts
// 핵심 10개 stories 의 시각 회귀 smoke. PR 에서 토큰 / 컴포넌트 변경의 unintended
// 시각적 영향을 차단한다. 베이스라인은 ./tests/visual/__screenshots__/ 에 git 으로 관리.
import { test, expect } from "@playwright/test";

const STORIES = [
  // Patterns - 디자인 시스템의 실제 화면 검토
  { id: "patterns-settings-page--default", name: "settings-page-default" },
  { id: "patterns-settings-page--dark", name: "settings-page-dark" },
  { id: "patterns-data-table-with-filters--default", name: "data-table-default" },
  { id: "patterns-data-table-with-filters--dark", name: "data-table-dark" },
  { id: "patterns-empty-search-results--with-suggestions", name: "empty-search-suggestions" },
  { id: "patterns-file-upload-form--default", name: "file-upload-default" },
  { id: "patterns-account-activity--in-progress", name: "account-activity-progress" },
  // Components - 토큰 변경의 핵심 표적
  { id: "components-button--primary", name: "button-primary" },
  { id: "components-alert--success", name: "alert-success" },
  { id: "components-alert--destructive", name: "alert-destructive" },
];

for (const story of STORIES) {
  test(`smoke: ${story.name}`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story`);
    // story body 가 마운트되고 lucide / radix 의 first paint 까지 대기
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot(`${story.name}.png`, {
      fullPage: true,
    });
  });
}
