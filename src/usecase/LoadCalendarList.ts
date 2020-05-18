// -----------------------------------------------------------------------------
// エイリアス
// -----------------------------------------------------------------------------
type Calendars = string[][];

// -----------------------------------------------------------------------------
//  クラス
// -----------------------------------------------------------------------------
/**
 * カレンダーリストの読み込み ユースケース
 */
export class LoadCalendarList {
  /**
   * カレンダーシート作成
   * ・全カレンダーを取得し、シートに出力
   */
  execute(): void {
    const calendars: Calendars = this.getCalendars();
    this.pushCalendars(calendars);
  }

  /**
   * Googleカレンダーからカレンダー取得
   */
  private getCalendars(): Calendars {
    const googleCalendars = CalendarApp.getAllCalendars();
    googleCalendars.sort((cal1, cal2) => {
      if (cal1.getName() > cal2.getName()) {
        return 1;
      } else {
        return -1;
      }
    });

    const calendars: Calendars = [['カレンダー名', 'ID']];
    googleCalendars.forEach((calendar) => {
      const name = calendar.getName();
      const id = calendar.getId();
      calendars.push([name, id]);
    });

    return calendars;
  }

  /**
   * カレンダー情報をスプレッドシートに反映
   * @param calendars
   */
  private pushCalendars(calendars: Calendars): void {
    const sheet = this.getSheet('calendars');
    sheet.clearContents();
    sheet
      .getRange(1, 1, calendars.length, calendars[0].length)
      .setValues(calendars);
  }

  /**
   * シートの取得。指定のシートがなければ作成
   * @param sheetName
   */
  private getSheet(sheetName: string): GoogleAppsScript.Spreadsheet.Sheet {
    let sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
    if (!sheetName) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
      sheet.setName(sheetName);
    }
    return sheet;
  }
}
