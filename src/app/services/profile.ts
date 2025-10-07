import { Injectable } from '@angular/core';
import { IProfile } from '../utils/interface';

@Injectable({
  providedIn: 'root',
})
export class Profile {
  profile: IProfile = {
    name: 'M. Abu Amar Al Badawi',
    role: 'Software Engineer',
    email: 'abuamar.albadawi@email.com',
    website: 'https://www.abuamar.site',
    phone: '+62 815 2047 1914',
    location: 'Daerah Istimewa Yogyakarta, Indonesia',
  };

  getProfile() {
    return this.profile;
  }
}
