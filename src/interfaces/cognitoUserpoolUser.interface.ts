export interface Attribute {
  Name: string;
  Value: string;
}

export interface CognitoUserPoolUser {
  Username: string;
  Attributes: Attribute[];
  UserCreateDate: Date;
  UserLastModifiedDate: Date;
  Enabled: boolean;
  UserStatus: string;
}
