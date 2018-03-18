export class Doctor {
  id: number;
  firstName: string;
  lastName: string;
  constructor(id = '', fName = '', lName = ''){
    this.id = id;
    this.firstName = fName;
    this.lastName = lName;
  }
}
