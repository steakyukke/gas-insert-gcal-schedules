// -----------------------------------------------------------------------------
// 定数
// -----------------------------------------------------------------------------
import { TARGET_DATE_CELL } from './InsertRoutineSchedules';

// -----------------------------------------------------------------------------
//  クラス
// -----------------------------------------------------------------------------
/**
 * 指定日の予定全削除 ユースケース
 */
export class DeleteOwnedSchedules {
  /**
   * 【デバッグ用】
   *  指定日の予定を全て削除する
   *    ※自分が所有しているカレンダーのみ対象
   */
  excute(): void {
    const calendars = CalendarApp.getAllOwnedCalendars();
    const activeSheet = SpreadsheetApp.getActiveSheet();
    const targetDate = activeSheet.getRange(TARGET_DATE_CELL).getValue();
    if (!targetDate) {
      // eslint-disable-next-line prettier/prettier
      Browser.msgBox('日付を入力してください');
      return;
    }

    calendars.forEach((calendar) => {
      const events = calendar.getEventsForDay(targetDate);
      events.forEach((event) => {
        event.deleteEvent();
      });
    });
  }
}
