import log from 'lambda-log'
import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent, Callback, Context } from 'aws-lambda'
import * as admin from 'firebase-admin'
import { readFileSync } from 'fs'
import path from 'path'
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { Result } from '../../helpers/core/Result'

const serviceAccount = readFileSync(path.join(__dirname, '..', '..', './firebase-certificate.json'), 'utf8')

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
})

const validateAccessToken = (accessToken: string): Promise<Result<DecodedIdToken>> => {
  const token = accessToken.replace('Bearer ', '').trim()

  return admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken: DecodedIdToken) => Result.ok(decodedToken))
    .catch((error) => Result.fail<DecodedIdToken>(error))
}

export const handler = async (event: APIGatewayTokenAuthorizerEvent, _: Context, callback: Callback) => {
  const result = await validateAccessToken(event.authorizationToken)

  if (result.isFailure) {
    log.info('Invalid token', { error: result.getValue(), event })
    return callback('Unauthorized')
  }

  const decodedToken = result.getValue()

  return {
    principalId: decodedToken.sub,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        },
      ],
    },
    context: {
      userId: decodedToken.uid,
      email: decodedToken.email,
      signInProvider: decodedToken.firebase.sign_in_provider,
    },
  } as APIGatewayAuthorizerResult
}
