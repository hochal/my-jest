import { sendEmail, sendSMS } from './messageService';

export function register(user) {
  /* DB에 회원 추가 */
  const message = '회원 가입을 환영합니다!';
  sendEmail(user.email, message);
  sendSMS(user.phone, message);
}

export function deregister(user) {
  /* DB에 회원 삭제 */
  const message = '탈퇴 처리 되었습니다.';
  sendEmail(user.email, message);
  sendSMS(user.phone, message);
}
