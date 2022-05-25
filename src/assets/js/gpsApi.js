function gpsApi()
{
    // ***
    this.assets = {}
    this.username = '';
    this.password = '';
    this.apikey = '';
    this.token = '';
    this.lastConn = '';
    this.serverHost = 'https://api.service24gps.com';
    //this.serverHost = 'https://api.redgps.com';

    this.lastResponse = {};

    this.errors = {
            '30300':'Bad Request â€“ Solicitud incorrecta',
            '30400':'Invalid User Token â€“ Token incorrecto, se debe solicitar uno nuevo',
            '30500':'Invalid Credentials â€“ Credenciales no vaÌlidas',
            '30600':'Device Error â€“ Dispositivo incorrecto o no autorizado',
            '30700':'Database Error â€“ Error al obtener los datos',
            '40100':'No data found â€“ No se encontraron datos para las unidades',
            '60500':'Endpoint Error â€“ Intento acceder a un meÌtodo/accioÌn no autorizado',
            '99500':'Service Unavailable â€“ El servicio no se encuentra disponible}'
        }

    this.getAssets = function( callback ){
        return this.getAllAssets( callback );
    }

    this.callBack = function( response ){
        if( response.status == 200 ){
            this.lastResponse = response.data;
        }else{
            this.lastResponse = response;
        }
    }
    //Metodo generico para cualquier peticio
    this.execute = function(path = '', data_send = {}, isAsync = false, callback, extra_data){
        var url = this.serverHost + '/api/v1/' + path;

        //Add APIKEY and tocken on all request.
        data_send.apikey = this.apikey;
        data_send.token = this.token;

        if( this.token == '' ){
            console.log('Error, token is empty');
            return false;
        }

        var datos = null;
        $.ajax({
            url: url,
            type: "POST",
            async: isAsync,
            data: data_send,
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                datos =  data;
                if(typeof callback == 'function'){
                    callback(!extra_data? {} : !!extra_data.module ? extra_data.module : {}, data.data, !extra_data? {} : !!extra_data.target_element ? extra_data.target_element : '');
                } else if(Array.isArray(callback)){
                    callback.forEach(c => {
                        if(typeof callback == 'function'){
                            c(data);
                        } else {
                            eval(`${c}(${JSON.stringify(data)})`)
                        }
                    });
                }
            },
            error:function( error ){
                datos = error;
                if(typeof callback == 'function'){
                    callback(!extra_data? {} : !!extra_data.module ? extra_data.module : {}, error.data, !extra_data? {} : !!extra_data.target_element ? extra_data.target_element : '');
                } else if(Array.isArray(callback)){
                    callback.forEach(c => {
                        if(typeof callback == 'function'){
                            c(error);
                        } else {
                            eval(`${c}(${JSON.stringify(error)})`)
                        }
                    });
                }
            }
        })
        return !!datos && !!datos.data ? datos.data : null;
    }

    this.getSensors = function(callback = null){
        var url = this.serverHost + '/api/v1/getSensors';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.getDrivers = function(callback = null){
        var url = this.serverHost + '/api/v1/driverInfoGetAll';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.createDriver = function(dataDriver, callback = null){
        var url = this.serverHost + '/api/v1/createDriver';
        var data_send = dataDriver;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.updateDriver = function(dataDriver, callback = null){
        var url = this.serverHost + '/api/v1/updateDriver';
        var data_send = dataDriver;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.deleteDriver = function(dataDriver, callback = null){
        var url = this.serverHost + '/api/v1/deleteDriver';
        var data_send = dataDriver;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.setModuleToUser = function(user_id, module_id, active = 1, callback = null){
        var url = this.serverHost + '/api/v1/setModuleToUser';
        var data_send = {
            userId : user_id,
            modeuloId : module_id,
            active : active
        };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.setFirebaseToken = function(uiddevice, firebasetoken, callback = null){
        var url = this.serverHost + '/api/v1/setMobileFirebaseToken';
        var data_send = {
            uiddevice : uiddevice,
            firebasetoken : firebasetoken
        };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.getModulesByUser = function(callback = null){
        var url = this.serverHost + '/api/v1/getModulesByUser';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.getRoutes = function(callback = null){
        var url = this.serverHost + '/api/v1/getRoutes';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.getScheduledRoutes = function(callback = null){
        var url = this.serverHost + '/api/v1/getScheduledRoutes';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.deleteRoute = function(route_id, callback = null){
        if( typeof route_id == 'undefined' || route_id == '' || parseInt(route_id) <= 0 ){
            var error_desc = { error: 'route_id is required', };
            console.error( error_desc );
            return error_desc;
        }
        var url = this.serverHost + '/api/v1/deleteRoute';
        var data_send = { idRuta: route_id };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }


    this.getPlaces = function(callback = null){
        var url = this.serverHost + '/api/v1/getPlaces';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.deletePlace = function(place_id, callback = null){
        if( typeof place_id == 'undefined' || place_id == '' || parseInt(place_id) <= 0 ){
            var error_desc = { error: 'place_id is required', };
            console.error( error_desc );
            return error_desc;
        }
        var url = this.serverHost + '/api/v1/deletePlace';
        var data_send = { idLugar: place_id };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.updatePlace = function(place_id, name, address, lat = '', lng = '',
            desc = '', phone = '', email = '', only_my_user = 0,
            icon = 'cluster3', callback = null){

        if( typeof place_id == 'undefined' || place_id == ''){
            var error_desc = { error: 'place_id is required', };
            console.error( error_desc );
            return error_desc;
        }

        if( typeof name == 'undefined' || name == ''){
            var error_desc = { error: 'name is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof lat == 'undefined' || lat == '' || parseInt(lng) == 0 ){
            var error_desc = { error: 'lat is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof lng == 'undefined' || lng == '' || parseInt(lng) == 0 ){
            var error_desc = { error: 'lng is required', };
            console.error( error_desc );
            return error_desc;
        }

        var url = this.serverHost + '/api/v1/updatePlace';
        var data_send = {
            idLugar : place_id,
            nombre : name,
            direccion : address,
            latitud : lat,
            longitud : lng,
            descripcion : desc,
            telefono : phone,
            email: email,
            solo_mi_usuario : only_my_user,
            icono : icon
        };

        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }


    this.createPlace = function(name, address, lat, lng, desc = '', phone = '',
            email = '', only_my_user = 0, icon = 'cluster3', callback = null){
        if( typeof name == 'undefined' || name == ''){
            var error_desc = { error: 'name is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof lat == 'undefined' || lat == '' || parseInt(lng) == 0 ){
            var error_desc = { error: 'lat is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof lng == 'undefined' || lng == '' || parseInt(lng) == 0 ){
            var error_desc = { error: 'lng is required', };
            console.error( error_desc );
            return error_desc;
        }

        var url = this.serverHost + '/api/v1/createPlace';
        var data_send = {
            nombre : name,
            direccion : address,
            latitud : lat,
            longitud : lng,
            descripcion : desc,
            telefono : phone,
            email: email,
            solo_mi_usuario : only_my_user,
            icono : icon
        };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }


    this.getGeofences = function(callback = null){

        var url = this.serverHost + '/api/v1/getGeofences';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }


    this.getAlerts = function(device_id, date, callback = null){
        if( typeof device_id == 'undefined' || device_id == ''){
            var error_desc = { error: 'device_id is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof date == 'undefined' || date == ''){
            var error_desc = { error: 'date is required "Date (yyyy-mm-dd)"', };
            console.error( error_desc );
            return error_desc;
        }

        var url = this.serverHost + '/api/v1/getAlerts';
        var data_send = {
            equipo : device_id,
            fecha : date,
        };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.deleteGeofence = function(idgeofence, callback = null){

        var url = this.serverHost + '/api/v1/deleteGeofence';
        var data_send = { idCerca : idgeofence };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.updateGeofence = function(idgeofence, name, points, color = '#dc3545',
            radius = 80, speed_limit, only_my_user = 0, visible = 1, callback = null){

        if( typeof idgeofence == 'undefined' || idgeofence == ''){
            var error_desc = { error: 'idgeofence is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof name == 'undefined' || name == ''){
            var error_desc = { error: 'name is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof points == 'undefined' || points == ''){
            var error_desc = { error: 'points is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof source_gps == 'undefined' || source_gps == ''){
            source_gps = 0;
        }

        var url = this.serverHost + '/api/v1/updateGeofence';
        var data_send = {
                idCerca : idgeofence,
                nombre: name, puntos: points,
                color: color, visible: visible,
                radio: radius, limite_velocidad: speed_limit,
                solo_mi_usuario : only_my_user
            };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.createGeofence = function(name, points, type = 1, color = '#dc3545',
            radius = 80, speed_limit, only_my_user = 0, callback = null){

        if( typeof name == 'undefined' || name == ''){
            var error_desc = { error: 'name is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof points == 'undefined' || points == ''){
            var error_desc = { error: 'points is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof source_gps == 'undefined' || source_gps == ''){
            source_gps = 0;
        }

        var url = this.serverHost + '/api/v1/createGeofence';
        var data_send = {
                nombre: name, puntos: points,
                tipo_cerca: type, color: color,
                radio: radius, limite_velocidad: speed_limit,
                solo_mi_usuario : only_my_user
            };
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.getOdometer = function(device_id, date, source_gps, callback = null){
        if( typeof device_id == 'undefined' || device_id == ''){
            var error_desc = { error: 'device_id is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof date == 'undefined' || date == ''){
            var error_desc = { error: 'date is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof source_gps == 'undefined' || source_gps == ''){
            source_gps = 0;
        }

        var url = this.serverHost + '/api/v1/getOdometer';
        var data_send = { equipo: device_id, fecha: date, odometro_gps: source_gps};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    this.getHistory = function(device_id, datetime_start, datetime_end, callback = null){
        if( typeof device_id == 'undefined' || device_id == ''){
            var error_desc = { error: 'device_id is required', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof datetime_start == 'undefined' || datetime_start == ''){
            var error_desc = { error: 'datetime_start is required [yyyy-mm-dd hh:mm:ss]', };
            console.error( error_desc );
            return error_desc;
        }
        if( typeof datetime_end == 'undefined' || datetime_end == ''){
            var error_desc = { error: 'datetime_end is required [yyyy-mm-dd hh:mm:ss]', };
            console.error( error_desc );
            return error_desc;
        }

        // var url = this.serverHost + '/api/v1/history/get';
        var url = this.serverHost + '/api/v1/historyGetEvents';
        var data_send = { equipo : device_id };
        data_send.fechaIni = datetime_start;
        data_send.fechaFin = datetime_end;
        data_send.format = 'DateTime';
        return this.callAction( url, data_send, callback );
        // return this.lastResponse;
    }

    this.getAllAssets = function(callback = null){
        var url = this.serverHost + '/api/v1/vehicleGetAllComplete';
        var data_send = { sensores: 1};
        return this.callAction( url, data_send, callback );
        // return this.lastResponse;
    }
    this.vehicleGetAll = function(callback = null){
        return this.getAllAssets( callback );
    }

    this.getAssetsLastReport = function(callback = null){
        var url = this.serverHost + '/api/v1/getdata';
        var data_send = { sensores: 1};
        return this.callAction( url, data_send, callback );
        // return this.lastResponse;
    }

    this.callAction = function( url, data_send, callback ){
        console.warn('callAction::url', url)
        console.warn('callAction::data_send', data_send)
        console.warn('callAction::callback', callback)
        this.lastResponse = '';
        if( typeof data_send == 'undefined'){
            console.error('data send is required');
            return;
        }
        //Add APIKEY and tocken on all request.
        data_send.apikey = this.apikey;
        data_send.token = this.token;

        if( this.token == '' ){
            console.log('Error, token is empty');
            return false;
        }

        return $.ajax({
            url: url,
            dataType: 'json',
            type: "POST",
            data: data_send,
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                // console.log(data);
                console.warn('callAction::data', data)
                gpsApi.callBack( data );
                if( typeof callback == 'function' ){
                    if( typeof data.data != 'undefined' && data.data != '' ){
                        return data = data.data;
                    }
                    if( typeof data.status != 'undefined' && data.status != 200 ){
                        //Regresamos los errors.
                        return data.error_desc = gpsApi.errors[data.status];
                    }
                    return callback( data );
                }
            },
            error:function( data ){
                gpsApi.callBack( data );
                if( typeof callback == 'function' ){
                    if( typeof data.data != undefined ){
                        data = data.data;
                    }
                    callback( data );
                }
             }

        });
    }

    this.reconnect = function( username, password, apikey ){
        this.connect( username, password, apikey );
    }

    this.connect = function( username, password, apikey ){
        console.log('try connection '+ username + ' : ' + password + ' : ' + apikey );

        this.username = username;
        this.password = password;
        this.apikey = apikey;
        this.token = '';

        var dataAuth = {
                apikey : apikey,
                token : '',
                username : username,
                password : password
            };

        var api_url = this.serverHost + "/api/v1/gettoken";

        return $.ajax({
            url: api_url,
            dataType: 'json',
            type: "POST",
            data: dataAuth,
            xhrFields: {
                withCredentials: true
            },
            success: function(data){
                console.log("Sucess: ",data );
                gpsApi.lastConn = data;
                if( typeof data.data != 'undefined' ){
                    gpsApi.token = data.data;
                    return data;
                }
            },
            error:function( data ){
                console.log("Error: ",data );
                gpsApi.lastConn = data;
             }

        });

    }

    this.loginByToken = function(token, callback){
        return $.ajax({
            url: this.serverHost + '/api/v1/loginByToken',
            dataType: 'json',
            type: "POST",
            data: {token: token},
            success: function(data){
                for(var x in data.data){
                    if(x == 'apikey'){
                        console.info(x + " ===> " + data.data[x])
                        gpsApi.apikey = data.data[x]
                    }
                    if(x == 'token'){
                        console.info(x + " ===> " + data.data[x])
                        gpsApi.token = data.data[x]
                    }
                }
                if(typeof callback == 'function'){
                    callback();
                }
            },
            error:function( data ){
                gpsApi.callBack( data );
                if( typeof callback == 'function' ){
                    if( typeof data.data != undefined ){
                        data = data.data;
                    }
                    callback( data );
                }
             }

        });
    }

    /* ----- funciones para Ondelivery ----- */
    //listamos los vehiculos
    this.getAllAssetsOndelivery = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/vehicleGetAllComplete';
        var data_send = { sensores: 1};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos todos los productos
    this.getAllProducts = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAllProducts';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un producto
    this.createProduct = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addProduct';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un producto
    this.editProduct = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editProduct';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //Valida la disponibilidad de productos en inventario
    this.checkProductAvailability = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/checkProductAvailability';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos todos los almacenes
    this.getAllWareHouse = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAllWareHouse';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un almacen
    this.createWareHouse = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addWareHouse';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un almacen
    this.editWareHouse = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editWareHouse';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos todas las zonas
    this.getAllZones = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAllZones';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un almacen
    this.createZone = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addZone';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un almacen
    this.editZone = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editZone';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos todos los inventarios por zona
    this.getAllInventories = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getInventories';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos todos los movimientos de un inventario
    this.getInventoryMovements = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getInventoryMovements';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un inventario
    this.createInventory = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addInventory';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un inventario
    this.editInventory = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editInventory';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos todos los inventarios por activo
    this.getAllInventoriesVehiculo = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/geInventoriesVehiculo';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos todos los clientes
    this.getAllClient = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAllClient';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un cliente
    this.createClient = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addClient';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un cliente
    this.editClient = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editClient';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos los contactos del cliente
    this.getAllContactClient = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAllContactClient';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un contacto cliente
    this.createContactClient = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addContactClient';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un contacto cliente
    this.editContactClient = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editContactClient';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos los datos de un contacto
    this.getInfoContact = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getInfoContact';
        this.callAction( url, dataJson, callback );
        return this.lastResponse;
    }

    //listamos los datos de un domicilio
    this.getInfoAddress = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getInfoAddress';
        this.callAction( url, dataJson, callback );
        return this.lastResponse;
    }

    //listamos los domicilios del cliente
    this.getAllAddressClient = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAllAddressClient';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos los domicilios del cliente
    this.getAllAddress = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAllAddress';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un domicilios cliente
    this.createAddressClient = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addAddressClient';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un domicilios cliente
    this.editAddressClient = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editAddressClient';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos las opciones del vehiculo
    this.getOptionsVehicle = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getOptionsVehicle';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos opcion al vehiculo
    this.createOptionsVehicle = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/addOptionsVehicle';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos sus opciones al vehiculo
    this.editOptionsVehicle = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editOptionsVehicle';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos los pedidos ---->
    this.getPedidos = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getOrders';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos un pedido
    this.createOrder = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/createOrder';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos un pedido
    this.editOrder = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editOrder';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos el estatus de un pedido
    this.changeOrderStatus = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/changeOrderStatus';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //borramos un pedido
    this.deleteOrder = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/deleteOrder';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //abonamos a un pedido.
    this.payOrder = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/payOrder';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos los status 
    this.getStatuses = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getStatuses';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos el detalle de un pedido 
    this.getOrderDetail = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getOrderDetail';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //detalle de movimientos de cuenta de un cliente
    this.getAccountDetail = function(dataJson, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getAccountDetail';
        var data_send = dataJson;
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //activos que tienen configurado las opciones
    this.getAllAssetsOptions = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/vehicleGetAll';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //listamos las entregas
    this.getDelivers = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getDelivers';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos una entrega manual
    this.createManualDeliver = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/createManualDeliver';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //creamos una entrega automatica
    this.createAutomaticDelivers = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/createAutomaticDelivers';
        //var url = 'http://dev_api.redgps.com/api/v1/ondelivery/createAutomaticDelivers';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //editamos una entrega
    this.editDelivery = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editDelivery';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //se valida si un pedido se puede despachar por tiempo, peso o volumen
    this.checkAvailableTimes = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/checkAvailableTimes';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //funcion para traer datos para el dash
    this.getDashboardData = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getDashboardData';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //se valida si un pedido se puede despachar por tiempo, peso o volumen
    this.getInventoryByWarehouse = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getInventoryByWarehouse';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //se obtienen los status por los ha pasado el pedido
    this.getStatusOrder = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getStatusOrder';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }

    //se obtienen detalle completo de un pedido
    this.getInfoOrder = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getInfoOrder';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }
    //se crea un motivo de cancelacion
    this.createReasonCancellation = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/createReasonCancellation';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }
    //se edita un motivo de cancelacion
    this.editReasonCancellation = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/editReasonCancellation';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }
    //se elimina un motivo de cancelacion
    this.deleteReasonCancellation = function(data_send, callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/deleteReasonCancellation';
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }
    //se obtioenen los motivos de cancelacion por default y los del cliente
    this.getReasonCancellationAll = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getReasonCancellationAll';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }
    //se obtioenen los motivos de cancelacion del cliente
    this.getReasonCancellationCliente = function(callback = null){
        var url = this.serverHost + '/api/v1/ondelivery/getReasonCancellationCliente';
        var data_send = {};
        this.callAction( url, data_send, callback );
        return this.lastResponse;
    }
    /* ----- Fin de Ondelivery ----- */

}

var gpsApi = new gpsApi();