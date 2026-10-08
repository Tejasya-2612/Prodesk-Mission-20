import test from 'node:test';import assert from 'node:assert/strict';import request from 'supertest';
process.env.NODE_ENV='test';process.env.JWT_SECRET='test-secret-at-least-32-characters-long';process.env.CLIENT_URL='http://localhost:5173';process.env.STRIPE_SECRET_KEY='sk_test_123';process.env.STRIPE_WEBHOOK_SECRET='whsec_test_secret';
const {default:app}=await import('../src/index.js');
test('health endpoint responds without database access',async()=>{const r=await request(app).get('/api/health');assert.equal(r.status,200);assert.equal(r.body.status,'ok')});
test('private endpoint returns 401 without authentication',async()=>{const r=await request(app).get('/api/client/dashboard');assert.equal(r.status,401)});
test('registration is closed by default, regardless of requested role',async()=>{const r=await request(app).post('/api/auth/register').send({name:'Attacker',email:'x@example.com',password:'long-password',role:'admin'});assert.equal(r.status,403)});
test('invalid Stripe signature is rejected before any database processing',async()=>{const r=await request(app).post('/api/webhooks/stripe').set('Content-Type','application/json').set('stripe-signature','t=1,v1=invalid').send(JSON.stringify({id:'evt_fake',type:'checkout.session.completed'}));assert.equal(r.status,400)});
