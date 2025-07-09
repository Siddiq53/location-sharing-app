let socket=io();
if(navigator.geolocation)
{
    navigator.geolocation.watchPosition(
        (position)=>{
            const {latitude,longitude}=position.coords;
            socket.emit("send-location",{latitude,longitude})
        },
        (error)=>{
            console.log(error)
        },
        {
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:0

        }
    )
}


let map=L.map("map").setView([0,0],5)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Shaik Siddiq Ahamad'
}).addTo(map);

let marker={}
let firstLoad = true;
socket.on("receive-location",(data)=>{
        console.log("New location:", data);
    const {id,latitude,longitude}=data;
    if (firstLoad) {
    map.setView([latitude, longitude], 16);
    firstLoad = false;
    }

    if(marker[id])
    {
        marker[id].setLatLng([latitude,longitude])
    }
    else
    {
let offset = Object.keys(marker).length * 0.0001;
marker[id] = L.marker([latitude + offset, longitude + offset])
    .addTo(map)
    }
})
socket.on("user-disconnected",(id)=>{
    if(marker[id])
    {
        map.removeLayer(marker[id])
        delete marker[id]
    }
})