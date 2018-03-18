export class Doctor {
  id: string;
  firstName: string;
  lastName: string;
  constructor(id = '', fName = '', lName = ''){
    this.id = id;
    this.firstName = fName;
    this.lastName = lName;
  }
}
