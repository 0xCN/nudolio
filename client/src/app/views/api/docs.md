# 📔 API Documentations
[nudolio](https://github.com/0xCN/nudolio) is an open-source key licensing API for licensing your softwares and personal projects with a dashing and easily usable dashboard for managing your products and keys.

### Registering Users

```bash
curl -X POST http://{host}/public-api/v1/user/register \
  -H 'Content-Type: application/json' \
  -d '{
        "name": "tester",
        "email": "tester@example.com",
        "password": "Tester123@"
      }'
```

#### Requirements 
```js
- name: minimum = 6, maximum = 30
- email: minimum = 8, maximum = 255
- password: minimum = 8, maximum = 100, should match the following regex "^(?=.*[a-z])(?=.*[0-9])"
// for the mortals who aren't able to read regex, it means your password should have numbers 🧠
```

### Activating Keys 

```bash
curl -X POST http://{host}/public-api/v1/activate \
  -H 'Content-Type: application/json' \
  -d '{
        "key": "077H-XNBS-BS6U-AEPL",
        "hardware_key": "HardwareKeyGeneratedFromClient",
        "email": "test@example.com",
        "password": "Test123@"
      }'
```
Note: The hardware key should be something unique generated from the client device

###### made with ❤️ by [nudlツ](https://github.com/0xCN/)
