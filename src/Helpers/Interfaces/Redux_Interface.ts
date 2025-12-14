export interface Redux_Interface {
    Login: LoginRedux;
    FixCssOnUploadStatus: boolean;
    UIData:UIDataRedux
  }
  export interface UIDataRedux {
    direction: "ltr"|"rtl";
  }
  export interface LoginRedux {
    loginstate: boolean;
    Token: string | null;
    ExpireDate: number | null;
  }
  