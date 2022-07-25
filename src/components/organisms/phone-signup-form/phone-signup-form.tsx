import { ConfirmationResult } from 'firebase/auth';
import { ChangeEvent, useState } from 'react';
import firebaseApp from '../../../firebase';

const PhoneSignupForm = () => {
  const [confiremObj, setConfiremObj] = useState<ConfirmationResult | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [show, setShow] = useState(false);

  const [code, setCode] = useState('');

  const handleSignupPhoneNumber = async () => {
    try {
      const res = await firebaseApp.signInWithPhoneNumber(phoneNumber);

      if (res) {
        console.log({ res });
        setShow(true);
        setConfiremObj(res);
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  const handleSubmitNumber = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phoneNumber) {
      setErrorMsg('error');
      return;
    }

    console.log(phoneNumber);
    setErrorMsg('');
    handleSignupPhoneNumber();
  };

  const handleChangePhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!code) {
      setErrorMsg('error');
      return;
    }

    setErrorMsg('');
    console.log(code);

    try {
      await confiremObj?.confirm(code);
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <>
      {!show && (
        <div className='max-w-md m-auto'>
          {errorMsg && (
            <div className='p-4 border-red-700 bg-red-100 text-red-600 border rounded-md'>
              <p className='text-base'>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmitNumber}>
            <div className='container'>
              <div className='my-3'>
                <input
                  type='text'
                  placeholder='Phone number'
                  onChange={handleChangePhoneNumber}
                  className='p-2 border border-gray-600'
                />
              </div>
              <div id='recaptcha-container' />

              <button className='bg-blue-600 px-4 py-2 text-white'>Submit Phone Number</button>
            </div>
          </form>
        </div>
      )}
      {show && (
        <div className='max-w-md m-auto'>
          {errorMsg && (
            <div className='p-4 border-red-700 bg-red-100 text-red-600 border rounded-md'>
              <p className='text-base'>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmitCode}>
            <div className='container'>
              <div className='my-3'>
                <input
                  type='text'
                  placeholder='Code'
                  onChange={handleChangeCode}
                  className='p-2 border border-gray-600'
                />
              </div>

              <button className='bg-blue-400 px-4 py-2 w-40'>Submit Code</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PhoneSignupForm;
