const express = require('express');
const app = express();

app.get('/', (rep, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.use('/public', express.static(__dirname + '/public'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.listen(5000, function () {
    console.log('servidor NODE corriendo correctamente en puerto 5000')
})