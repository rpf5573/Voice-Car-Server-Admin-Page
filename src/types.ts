// from : https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
// 속성을 override할 수 있다
interface Window { __PRELOADED_STATE__: Admin.InitialStateFromDB }
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
    assist: string
  }
  enum Role {
    admin = 'admin',
    user = 'user',
    assist = 'assit'
  }
  type ResultDataRow = {
    team: number,
    useable: number,
    totalPoint: number,
    rank: number
  }
  interface InitialStateFromDB {
    teamSettings: {
      teamPasswords: TeamPassword[],
      teamCount: number
    },
    modalControl: {
      activeModalClassName: string | undefined,
      activeMenuBtnClassName: string | undefined
    },
    uploads: {
      companyImage: string,
      map: string
    },
    adminPasswords: string,
    postInfos: PostInfo[] | undefined
  }
  interface InitialState extends Omit<InitialStateFromDB, 'adminPasswords'> {
    adminPasswords: AdminPassword
  }
  type SourcePath = {
    style: string,
    js: string
  }
  interface DCQueryInterface {
    initialState(role: Role): InitialStateFromDB|undefined,
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
}