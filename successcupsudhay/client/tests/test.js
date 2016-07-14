'use strict';
/*global describe */
/*global beforeEach*/
/*global it */
/*global angular */
/*global jasmine*/
/*global inject */
/*global expect*/
/*global document */
/*
 This is the test file which contains the Mocha/jasmine tests and it tests the angular modules by mocking service
 responses
 */
(function() {

    // To DO Controller Spec
    describe('Custom ToDo Angular controllers', function() {
        describe('ToDoController', function() {
            //Before each test, the module is declared
            beforeEach(function() {
                angular.mock.module('toDo');
            });

            // Initialize the controller and a mock scope
            var ToDoController,
                scope,
                $httpBackend;

            // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
            // This allows us to inject a service but then attach it to a variable
            // with the same name as the service.
            beforeEach(inject(function($controller, $rootScope,  _$httpBackend_) {
                scope = $rootScope.$new();
                ToDoController = $controller('ToDoController', {
                    $scope: scope
                });

                $httpBackend =  _$httpBackend_;


            }));


            it('Initialisation must retrieve all the todos and assign to the scope variable', function() {

                //Sample response to get all todos service call
                var responseForInitialGetService = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746a48abb6a84b8053e7bb5",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };

                //test if the get service is called and send the sample response.
                $httpBackend.expectGET('\/api\/todos').respond(responseForInitialGetService());

                //flush pending requests
                $httpBackend.flush();

                // test form input(s) are reset
                expect(scope.loading).toEqual(false);
                expect(scope.formData).toEqual({});
                //test if the todos list is assigned to the scope
                expect(scope.todos).toEqual(responseForInitialGetService().data);

            });

            it('$scope.create() with valid form data should send a POST request ' +
                'with the form input values and then ', function() {

                // POST data to be sent for the create service call
                var postData = function() {
                    return {
                        "task_name":"ToDo Task 2"
                    };
                };

                // fixture expected response data for the initial get service
                var responseForInitialGetService = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746a48abb6a84b8053e7bb5",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };

                // fixture expected response data for the post service
                var responseForPostRequest = function() {
                    return {
                        "status": "Success",
                        "data": {
                            "__v": 0,
                            "task_name": "ToDo Task 2",
                            "_id": "5746d927007ed23425e27c29"
                        }
                    };
                };

                // fixture expected response data for the get service after the post call
                var responseForGetRequest = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746d927007ed23425e27c29",
                                "task_name": "ToDo Task 2",
                                "__v": 0
                            },
                            {
                                "_id": "5746d971007ed23425e27c2a",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };


                // fixture mock form input values
                scope.formData.task_name= 'ToDo Task 2';

                //Initially GET call to get all toDos is called when the page is loaded
                $httpBackend.expectGET('\/api\/todos').respond(responseForInitialGetService());

                // Run controller
                scope.createTodo(true);

                // test post request is sent
                $httpBackend.expectPOST('\/api\/todos', postData()).respond(responseForPostRequest());

                //test get request called to get the final list of todos
                $httpBackend.expectGET('\/api\/todos').respond(responseForGetRequest());

                $httpBackend.flush();

                // test form input(s) are reset
                expect(scope.loading).toEqual(false);
                expect(scope.formData).toEqual({});
                //test if the response is assigned to the todos variable which displays the new list of todos
                expect(scope.todos).toEqual(responseForGetRequest().data);

            });

            it('$scope.deleteTodo() with valid form data should send a DELETE request ' +
                'with the form input values', function() {


                // fixture expected response data for the initial get service
                var responseForInitialGetService = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746d927007ed23425e27c29",
                                "task_name": "ToDo Task 2",
                                "__v": 0
                            },
                            {
                                "_id": "5746d971007ed23425e27c2a",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };


                // fixture expected response data for Delete request
                var responseToDeleteRequest = function() {
                    return {
                        "status": "Success",
                        "data": "Deleted Successfully"
                    };
                };

                // fixture expected response data for the get service after the delete call
                var responseForGetRequest = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746d971007ed23425e27c2a",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };
                $httpBackend.expectGET('\/api\/todos').respond(responseForInitialGetService());

                // Run controller
                scope.deleteTodo('5746d927007ed23425e27c29');

                // test delete request is sent
                $httpBackend.expectDELETE('\/api\/todos/5746d927007ed23425e27c29').respond(responseToDeleteRequest());

                //test get request called to get the final list of todos
                $httpBackend.expectGET('\/api\/todos').respond(responseForGetRequest());

                $httpBackend.flush();

                // test form input(s) are reset
                expect(scope.loading).toEqual(false);
                //test if the response is assigned to the todos variable which displays the new list of todos
                expect(scope.todos).toEqual(responseForGetRequest().data);

            });

            it('$scope.updateToDo() with valid form data should send a PUT request ' +
                'with the form input values', function() {
                //Add a dummy element in the document with the old and new to do values to check if they are updated.
                var fixture = '<input type="text" id="5746d971007ed23425e27c2a" value="ToDo Task 3">' +
                    '</input>';
                //fixture the html elements in order to test if the value of the element is being used.
                document.body.insertAdjacentHTML(
                    'afterbegin',
                    fixture);

                // fixture expected response data for the initial get service
                var responseForInitialGetService = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746d927007ed23425e27c29",
                                "task_name": "ToDo Task 2",
                                "__v": 0
                            },
                            {
                                "_id": "5746d971007ed23425e27c2a",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };

                // PUT data to be sent for the create service call
                var putData = function() {
                    return {
                        "task_name":"ToDo Task 3"
                    };
                };

                // fixture expected response data for Delete request
                var responseToPutRequest = function() {
                    return {
                        "status": "Success",
                        "data": {
                            "_id": "5746d971007ed23425e27c2a",
                            "task_name": "ToDo Task 3",
                            "__v": 0
                        }
                    };
                };

                // fixture expected response data for the get service after the PUT call
                var responseForGetRequest = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746d927007ed23425e27c29",
                                "task_name": "ToDo Task 2",
                                "__v": 0
                            },
                            {
                                "_id": "5746d971007ed23425e27c2a",
                                "task_name": "To do 3",
                                "__v": 0
                            }
                        ]
                    };
                };
                $httpBackend.expectGET('\/api\/todos').respond(responseForInitialGetService());

                // Run the function present in the controller to be tested
                scope.saveEdit({"_id":"5746d971007ed23425e27c2a","task_name":"ToDo Task 1","__v":0,"isEditable":true});

                // test if delete request is sent
                $httpBackend.expectPUT('\/api\/todos/5746d971007ed23425e27c2a',putData()).respond(responseToPutRequest());

                //test if the get request called to get the final list of todos
                $httpBackend.expectGET('\/api\/todos').respond(responseForGetRequest());

                $httpBackend.flush();

                // test form input(s) are reset
                expect(scope.loading).toEqual(false);
                //test if the response is assigned to the todos variable which displays the new list of todos
                expect(scope.todos).toEqual(responseForGetRequest().data);

            });
            it('$scope.deleteTodo() with valid form data should send a DELETE request ' +
                'with the form input values', function() {


                // fixture expected response data for the initial get service
                var responseForInitialGetService = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746d927007ed23425e27c29",
                                "task_name": "ToDo Task 2",
                                "__v": 0
                            },
                            {
                                "_id": "5746d971007ed23425e27c2a",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };


                // fixture expected response data for Delete request
                var responseToDeleteRequest = function() {
                    return {
                        "status": "Success",
                        "data": "Deleted Successfully"
                    };
                };

                // fixture expected response data for the get service after the delete call
                var responseForGetRequest = function() {
                    return {
                        "status": "Success",
                        "data": [
                            {
                                "_id": "5746d971007ed23425e27c2a",
                                "task_name": "ToDo Task 1",
                                "__v": 0
                            }
                        ]
                    };
                };
                $httpBackend.expectGET('\/api\/todos').respond(responseForInitialGetService());

                // Run controller
                scope.deleteTodo('5746d927007ed23425e27c29');

                // test delete request is sent
                $httpBackend.expectDELETE('\/api\/todos/5746d927007ed23425e27c29').respond(responseToDeleteRequest());

                //test get request called to get the final list of todos
                $httpBackend.expectGET('\/api\/todos').respond(responseForGetRequest());

                $httpBackend.flush();

                // test form input(s) are reset
                expect(scope.loading).toEqual(false);
                //test if the response is assigned to the todos variable which displays the new list of todos
                expect(scope.todos).toEqual(responseForGetRequest().data);

            });

            //The Test case which checks if the edit elements are displayed and hidden on click of edit button
            it('$scope.toggleEdit() with valid form data should show and hide the UI elements appropriately',
                function() {
                    //The to do object which is used for testing toggle of edit button
                    var todoWhichIsToggled={"_id":"574bf050e571a8e022d4967b","task_name":"To Do 2","__v":0,
                        "isEditable":false};

                    //Add a dummy HTML elements for a single to do in the document

                    var fixture =

                        '<a href="#" class="btn" id="icon1_574bf050e571a8e022d4967b">'+
                        '    <span class="glyphicon glyphicon-pencil" ></span>'+
                        '</a>'+
                        '<a href="#" class="btn"  id="icon2_574bf050e571a8e022d4967b">'+
                        '    <span class="glyphicon glyphicon-trash" ></span>'+
                        '</a>'+
                        '<input type="text" id="574bf050e571a8e022d4967b" value="ToDo Task 3">' +
                        '</input>'+
                        '<a href="#" class="btn" id="icon3_574bf050e571a8e022d4967b" style="display: none;">'+
                        '    <span class="glyphicon glyphicon-ok"  ></span>'+
                        '</a>'+
                        '<a href="#" class="btn" id="icon4_574bf050e571a8e022d4967b" style="display: none;">'+
                        '    <span class="glyphicon glyphicon-remove"   ></span>'+
                        '</a>';

                    //fixture the html elements in order to test if the value of the element is being changed.
                    document.body.insertAdjacentHTML(
                        'afterbegin',
                        fixture);

                    //Call the controller function
                    scope.toggleEdit(todoWhichIsToggled);

                    //Get the elements from the documents to check their style values
                    var editButton = document.getElementById("icon1_574bf050e571a8e022d4967b");
                    var trashButton = document.getElementById("icon2_574bf050e571a8e022d4967b");
                    var okButton = document.getElementById("icon3_574bf050e571a8e022d4967b");
                    var cancelButton = document.getElementById("icon4_574bf050e571a8e022d4967b");
                    //The edit button must be hidden
                    expect(editButton.style.display).toEqual("none");
                    //The trash button must be hidden
                    expect(trashButton.style.display).toEqual("none");
                    //The OK button must be displayed to save the edit
                    expect(okButton.style.display).toEqual("inline-block");
                    //The Cancel button must be displayed to cancel the edit
                    expect(cancelButton.style.display).toEqual("inline-block");


                });

            it('$scope.cancelEdit() should hide the edit views and display the old todo which was present in the UI'
                , function() {

                    //The to do object which is used for testing cancel of edit

                    var todoWhichIsCancelled={"_id":"574bf050e571a8e022d4967b","task_name":"To Do 2","__v":0,
                        "isEditable":true};

                    //Add a dummy HTML elements for a single to do in the document

                    var fixture =

                        '<a href="#" class="btn" id="icon1_574bf050e571a8e022d4967b">'+
                        '    <span class="glyphicon glyphicon-pencil" ></span>'+
                        '</a>'+
                        '<a href="#" class="btn"  id="icon2_574bf050e571a8e022d4967b">'+
                        '    <span class="glyphicon glyphicon-trash" ></span>'+
                        '</a>'+
                        '<input type="text" id="574bf050e571a8e022d4967b" value="ToDo Task 3">' +
                        '</input>'+
                        '<a href="#" class="btn" id="icon3_574bf050e571a8e022d4967b" style="display: none;">'+
                        '    <span class="glyphicon glyphicon-ok"  ></span>'+
                        '</a>'+
                        '<a href="#" class="btn" id="icon4_574bf050e571a8e022d4967b" style="display: none;">'+
                        '    <span class="glyphicon glyphicon-remove"   ></span>'+
                        '</a>';

                    //fixture the html elements in order to test if the value of the element is being used.
                    document.body.insertAdjacentHTML(
                        'afterbegin',
                        fixture);

                    //Call the controller dunction with the to do object to test cancel of edit.
                    scope.cancelEdit(todoWhichIsCancelled);

                    //Get the elements from the documents to check their style values
                    var editButton = document.getElementById("icon1_574bf050e571a8e022d4967b");
                    var trashButton = document.getElementById("icon2_574bf050e571a8e022d4967b");
                    var okButton = document.getElementById("icon3_574bf050e571a8e022d4967b");
                    var cancelButton = document.getElementById("icon4_574bf050e571a8e022d4967b");
                    var textEditInput = document.getElementById("574bf050e571a8e022d4967b");
                    //The edit button must be displayed after edit is cancelled
                    expect(editButton.style.display).toEqual("inline-block");
                    //The trash button must be displayed to give option to delete
                    expect(trashButton.style.display).toEqual("inline-block");
                    //The OK button must be hidden
                    expect(okButton.style.display).toEqual("none");
                    //The Cancel button must be hidden
                    expect(cancelButton.style.display).toEqual("none");
                    //The old value must be replaced with the edited value present in the test box
                    expect(textEditInput.value).toEqual("To Do 2");

                });
        });
    });
}());
