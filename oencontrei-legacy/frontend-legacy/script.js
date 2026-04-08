function login(){
 let email = document.getElementById("email").value
 let senha = document.getElementById("senha").value

 if(email && senha){
  localStorage.setItem("logado", "true")

  document.getElementById("login").classList.add("hidden")
  document.getElementById("home").classList.remove("hidden")

  listar()
 }
}

function mostrarCadastro(){
 document.getElementById("home").classList.add("hidden")
 document.getElementById("cadastro").classList.remove("hidden")
}

function voltar(){
 document.getElementById("cadastro").classList.add("hidden")
 document.getElementById("home").classList.remove("hidden")
}

function cadastrar(){

 let formData = new FormData()

 formData.append("nome", document.getElementById("nome").value)
 formData.append("descricao", document.getElementById("desc").value)
 formData.append("local", document.getElementById("local").value)

 let file = document.getElementById("foto").files[0]

 if(file){
  formData.append("foto", file)
 }

 fetch("http://localhost:5000/objetos/", {
  method: "POST",
  body: formData
 })
 .then(res => res.json())
 .then(res => {
   console.log(res)

   voltar()
   listar()
 })
 .catch(err => {
   console.error("ERRO:", err)
 })
}

function listar(){
 fetch("http://localhost:5000/objetos/")
 .then(r => r.json())
 .then(dados => {
  let lista = document.getElementById("lista")
  lista.innerHTML = ""

  dados.forEach(item => {
    lista.innerHTML += `
      <div class="card">
        <h3>${item.nome}</h3>
       <p>${item.descricao}</p>
       <p><b>Local:</b> ${item.local || "Não informado"}</p>
        ${item.foto ? `<img src="http://localhost:5000/uploads/${item.foto}" width="100">` : ""}
      </div>
    `
  })
 })
}

window.onload = () => {
 if(localStorage.getItem("logado") === "true"){
  document.getElementById("login").classList.add("hidden")
  document.getElementById("home").classList.remove("hidden")
  listar()
 } else {
  document.getElementById("login").classList.remove("hidden")
 }
}