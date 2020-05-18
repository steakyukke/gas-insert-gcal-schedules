import { Schedule } from '../domain/Schedule';

// -----------------------------------------------------------------------------
// 定数
// -----------------------------------------------------------------------------
export const TARGET_DATE_CELL = 'B1';

const ROUTINE_SHEET_CHECK_CELL = 'A1';
const ROUTINE_SHEET_CHECK_VALUE = '日付';

const ROUTINE_LIST_START_ROW = 4;
const ROUTINE_LIST_START_COLUMN = 1;

const ROUTINE_LIST_INDEX_START_TIME = 0;
const ROUTINE_LIST_INDEX_END_TIME = 1;
const ROUTINE_LIST_INDEX_TITLE = 2;
const ROUTINE_LIST_INDEX_CALENDAR_NAME = 3;
const ROUTINE_LIST_INDEX_MEMO = 4;
const ROUTINE_LIST_INDEX_NUM = ROUTINE_LIST_INDEX_MEMO + 1;

// -----------------------------------------------------------------------------
//  クラス
// -----------------------------------------------------------------------------
export class InsertRoutineSchedules {
  /**
   * 表示中のシートから予定登録
   */
  excute(): void {
    const activeSheet = SpreadsheetApp.getActiveSheet();

    if (!this.isRoutineSheet(activeSheet)) {
      Browser.msgBox('スケジュール登録用シートではありません。');
      return;
    }

    const schedules = this.getSchedules(activeSheet);
    this.insertSchedules(schedules);
  }

  /**
   * スケジュール登録用のシートであるかチェック
   * @param sheet
   */
  private isRoutineSheet(sheet: GoogleAppsScript.Spreadsheet.Sheet): boolean {
    if (
      sheet.getRange(ROUTINE_SHEET_CHECK_CELL).getValue() !=
      ROUTINE_SHEET_CHECK_VALUE
    ) {
      return false;
    }
    return true;
  }

  /**
   * スプレッドシートからスケジュール情報を取得
   * @param sheet
   */
  private getSchedules(sheet: GoogleAppsScript.Spreadsheet.Sheet): Schedule[] {
    const lastRow = sheet.getLastRow();
    const routines = sheet
      .getRange(
        ROUTINE_LIST_START_ROW,
        ROUTINE_LIST_START_COLUMN,
        lastRow - ROUTINE_LIST_START_ROW + 1,
        ROUTINE_LIST_INDEX_NUM
      )
      .getValues();

    const schedules: Schedule[] = [];
    routines.forEach((routine) => {
      if (!this.isValidSchedule(routine)) {
        return;
      }

      // スケジュール登録用にデータ作成
      const schedule = new Schedule();
      schedule.calendarName = routine[ROUTINE_LIST_INDEX_CALENDAR_NAME];

      schedule.title = routine[ROUTINE_LIST_INDEX_TITLE].trim();

      const targetDate = sheet.getRange(TARGET_DATE_CELL).getValue();
      const startTime = routine[ROUTINE_LIST_INDEX_START_TIME];
      schedule.startDateTime = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        startTime.getHours(),
        startTime.getMinutes()
      );
      const endTime = routine[ROUTINE_LIST_INDEX_END_TIME];
      schedule.endDateTime = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        endTime.getHours(),
        endTime.getMinutes()
      );

      schedule.description = routine[ROUTINE_LIST_INDEX_MEMO];
      schedules.push(schedule);
    });

    return schedules;
  }

  /**
   * スケジュール情報の型チェック
   * @param routine
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isValidSchedule(routine: any[]): boolean {
    // 必須入力
    if (
      !routine[ROUTINE_LIST_INDEX_START_TIME] ||
      !routine[ROUTINE_LIST_INDEX_END_TIME] ||
      !routine[ROUTINE_LIST_INDEX_TITLE] ||
      !routine[ROUTINE_LIST_INDEX_CALENDAR_NAME]
    ) {
      return false;
    }

    // 型チェック
    const toString = Object.prototype.toString;
    if (
      toString.call(routine[ROUTINE_LIST_INDEX_START_TIME]) !== '[object Date]'
    ) {
      return false;
    }
    if (
      toString.call(routine[ROUTINE_LIST_INDEX_END_TIME]) !== '[object Date]'
    ) {
      return false;
    }
    if (typeof routine[ROUTINE_LIST_INDEX_TITLE] !== 'string') {
      return false;
    }
    if (typeof routine[ROUTINE_LIST_INDEX_CALENDAR_NAME] !== 'string') {
      return false;
    }
    if (typeof routine[ROUTINE_LIST_INDEX_MEMO] !== 'string') {
      return false;
    }

    return true;
  }

  /**
   * スケジュールの登録
   * @param schedules
   */
  private insertSchedules(schedules: Schedule[]): void {
    schedules.forEach((schedule) => {
      const calendars = CalendarApp.getCalendarsByName(schedule.calendarName);
      if (calendars.length == 0) {
        Browser.msgBox('カレンダー取得失敗:' + schedule.calendarName);
        return;
      } else if (calendars.length > 1) {
        Browser.msgBox('カレンダー名の重複エラー:' + schedule.calendarName);
        return;
      }

      calendars[0].createEvent(
        schedule.title,
        schedule.startDateTime,
        schedule.endDateTime,
        { description: schedule.description }
      );
    });
  }
}
