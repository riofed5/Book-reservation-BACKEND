import User from '../../src/models/User'
import UserService from '../../src/services/user'
import * as dbHelper from '../db-helper'

const nonExistingUserId = '5e57b77b5744fa0b461c7906'

export async function createUser() {
  const user = new User({
    firstName: 'Nhan',
    lastName: 'Nguyen',
    email: 'testing@gmail.com',
    password: 'password',
    isAdmin: false,
  })
  return await UserService.create(user)
}

describe('user service', () => {
  beforeEach(async () => {
    await dbHelper.connect()
  })

  afterEach(async () => {
    await dbHelper.clearDatabase()
  })

  afterAll(async () => {
    await dbHelper.closeDatabase()
  })

  it('should create a user', async () => {
    const newUser = await createUser()
    expect(newUser).toHaveProperty('_id')
    expect(newUser).toHaveProperty('firstName', 'Nhan')
  })

  it('should get a user with id', async () => {
    const user = await createUser()
    const found = await UserService.findById(user._id)
    expect(found.firstName).toEqual(user.firstName)
    expect(found._id).toEqual(user._id)
  })

  //   // Check https://jestjs.io/docs/en/asynchronous for more info about
  //   // how to test async code, especially with error
  it('should not get a non-existing user', async () => {
    expect.assertions(1)
    return UserService.findById(nonExistingUserId).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should update an existing user', async () => {
    const user = await createUser()
    const update = {
      firstName: 'Shrek',
      isAdmin: true,
    }
    const updated = await UserService.update(user._id, update)
    expect(updated).toHaveProperty('_id', user._id)
    expect(updated).toHaveProperty('firstName', update.firstName)
    expect(updated).toHaveProperty('isAdmin', true)
  })

  it('should not update a non-existing user', async () => {
    expect.assertions(1)
    const update = {
      firstName: 'Shrek',
      isAdmin: true,
    }
    return UserService.update(nonExistingUserId, update).catch((e) => {
      expect(e.message).toMatch(`User ${nonExistingUserId} not found`)
    })
  })

  it('should delete an existing user', async () => {
    expect.assertions(1)
    const user = await createUser()
    await UserService.deleteUser(user._id)
    return UserService.findById(user._id).catch((e) => {
      expect(e.message).toBe(`User ${user._id} not found`)
    })
  })
})
