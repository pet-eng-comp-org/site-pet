// Roda uma vez, quando o banco do docker-compose.yml é criado: a conta que
// entra no painel. A senha é senha-local (hash bcrypt abaixo).
db.getSiblingDB("sitepet").members.insertOne({
  memberName: "Conta de teste",
  description: "Conta do ambiente local, para entrar no painel.",
  email: "admin@pet.local",
  password: "$2a$10$6f3vIRx.4mEQGu3gtaQHSOvVC4QrgwP2a5DIhZmT3OswS9OjhRxLW",
  phone: "27999990000",
  startPet: new Date("2024-01-01"),
  active: true,
  tutor: false,
  socialMidia: [],
});
