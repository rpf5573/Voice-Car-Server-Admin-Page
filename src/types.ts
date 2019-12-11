// from : https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
// 속성을 override할 수 있다
interface Window {
  __PRELOADED_STATE__: Admin.InitialState,
  __group__: string
}
declare namespace Admin {
  type TeamPassword = {
    team: number,
    password: string | undefined
  };
  type PostInfo = {
    post: number,
    mission: string,
    url: string
  }
  type AdminPassword = {
    admin: string,
  }
  enum Role {
    admin = 'admin',
    user = 'user',
  }
  type ResultDataRow = {
    team: number,
    useable: number,
    totalPoint: number,
    rank: number
  }
  interface InitialState {
    teamSettings: TeamSettings,
    modalControl: ModalControl,
    optionSettings: OptionSettings,
    uploads: Uploads,
    adminPasswords: AdminPassword,
  }
  type SourcePath = {
    style: string,
    js: string
  }
  interface DCQueryInterface {
    initialState(role: Role): InitialState|undefined,
    resultData(teamCount: number, puzzleBoxCount: number): ResultDataRow[]
    reset():never
  }
  interface MetasInterface {
    get(key: string|string[]):string|Object
    update(key: string, value: string|number|null):never
    reset():never
  }
  type MetaTableResult = {
    metaKey: string,
    metaValue: string | number,
  }
  type TeamSettings = {
    teamPasswords: TeamPassword[],
    teamCount: number,
  }
  type ModalControl = {
    activeModalClassName: string | undefined,
    activeMenuBtnClassName: string | undefined
  }
  type Uploads = {
    companyImage: string
  }
  type OptionSettings = {
    rcUsageState: number
  }
  type defaultWords = {
    hand_open: Array<string>,
    hand_close: Array<string>,
    elbow_open: Array<string>,
    elbow_close: Array<string>,
    shoulder_open: Array<string>,
    shoulder_close: Array<string>,
    waist_left: Array<string>,
    waist_right: Array<string>,
    bottom_go: Array<string>,
    bottom_go_fast: Array<string>,
    bottom_left: Array<string>,
    bottom_right: Array<string>,
    bottom_back: Array<string>
  }
  type defaultSpeeds = {
    hand_open: number,
    hand_close: number,
    elbow_open: number,
    elbow_close: number,
    shoulder_open: number,
    shoulder_close: number,
    waist_left: number,
    waist_right: number,
    bottom_go: number,
    bottom_go_fast: number,
    bottom_left: number,
    bottom_right: number,
    bottom_back: number,
  }
}