import { LoadCalendarList } from './usecase/LoadCalendarList';
import { InsertRoutineSchedules } from './usecase/InsertRoutineSchedules';
import { DeleteOwnedSchedules } from './usecase/DeleteOwnedSchedules';

// -----------------------------------------------------------------------------
// イベント
// -----------------------------------------------------------------------------
// GAS で登録したい関数を global オブジェクトのプロパティに代入する。
declare const global: {
  [x: string]: Function;
};

/**
 * スプレッドシートを開いたときに実行するイベントハンドラ
 */
global.onOpen = (): void => {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('<<カスタム>>')
    .addItem('①カレンダーリストの読み込み', 'loadCalendarList')
    .addItem('②スケジュール登録', 'insertRoutineSchedules')
    .addSeparator()
    .addItem('※注意※スケジュール削除', 'deleteOwnedSchedules')
    .addToUi();
};

// -----------------------------------------------------------------------------
// メソッド
// -----------------------------------------------------------------------------
/**
 * カレンダーリストの読み込み
 */
global.loadCalendarList = (): void => {
  const loadCalendarList = new LoadCalendarList();
  loadCalendarList.execute();
};

/**
 *  指定日の予定を全て削除する
 *    ※自分が所有しているカレンダーのみ対象
 */
global.deleteOwnedSchedules = (): void => {
  const deleteOwnedSchedules = new DeleteOwnedSchedules();
  deleteOwnedSchedules.excute();
};

/**
 * 表示中のシートから予定登録
 */
global.insertRoutineSchedules = (): void => {
  const insertRoutineSchedules = new InsertRoutineSchedules();
  insertRoutineSchedules.excute();
};
