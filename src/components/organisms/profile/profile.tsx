import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import firebaseApp from '../../../firebase';

const Profile = () => {
  const [photo, setPhoto] = useState<File | string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setPhoto(file);
    }
  };

  useEffect(() => {
    const user = firebaseApp.auth.currentUser;

    if (user && user.photoURL) {
      setPhoto(user.photoURL);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(photo);

    if (photo) {
      firebaseApp.updateProfile({ displayName: 'Arash', photo });
    }
  };

  return (
    <div className='p-4 border border-blue-600 max-w-md m-auto mt-4 flex gap-2'>
      <div className='rounded-full w-14 h-14'>
        <img
          src={
            typeof photo === 'string'
              ? photo
              : photo
              ? URL.createObjectURL(photo)
              : 'https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg'
          }
          className='w-full h-full object-contain'
          alt=''
        />
      </div>
      <h4>some</h4>
      <form onSubmit={handleSubmit}>
        <div>
          <input type='file' onChange={handleChange} />
        </div>
        <div>
          <button type='submit' className='bg-blue-400 m-4 px-8 py-1'>
            upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
