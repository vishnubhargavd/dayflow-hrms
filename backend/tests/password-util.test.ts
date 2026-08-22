import { hashPassword, comparePassword, generateTempPassword } from '../src/utils/password.util';

describe('Password Security Utilities', () => {
  it('should hash a password and verify it correctly', async () => {
    const password = 'SuperSecretPassword123!';
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2a$') || hash.startsWith('$2b$')).toBe(true);

    const isMatch = await comparePassword(password, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword('WrongPassword123!', hash);
    expect(isWrongMatch).toBe(false);
  });

  it('should generate a 12-character random temporary password', () => {
    const tempPassword = generateTempPassword(12);

    expect(tempPassword).toHaveLength(12);
    expect(typeof tempPassword).toBe('string');
  });
});
