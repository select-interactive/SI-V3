'use strict'; /**
              * Copyright 2016 Select Interactive, LLC. All rights reserved.
              * @author: The Select Interactive dev team (www.select-interactive.com)
              */
(function (doc) {
    'use strict';

    var alert = new app.Alert();

    var adminForm = new app.AdminForm({
        labelItemText: 'Project',
        labelItemsText: 'Projects',
        loadItems: {
            fn: 'projectsGetJson',
            params: {
                projectId: -1 },

            rowTmpl: '<div class="admin-grid-row{{rowClass}}" data-id="{{projectId}}">' +
            '<div class="admin-grid-col admin-grid-col-primary">{{name}}</div>' +
            '<div class="admin-grid-col">{{active}}</div>' +
            '<div class="admin-grid-col"><button class="btn btn-ripple btn-edit">Edit</button><button class="btn btn-ripple btn-delete">Delete</button></div>' +
            '</div>',
            rowTmplHeaders: ['', 'Name', 'Active'],
            rowTmplProps: ['projectId', 'name', 'active'] },

        editItem: {
            fn: 'projectsGetJson',
            params: {},
            itemId: 'projectId',
            callback: editItemCallback },

        saveItem: {
            fn: 'projectSave',
            itemId: 'projectId',
            sendAsString: true,
            callback: saveItemCallback },

        deleteItem: {
            fn: 'projectDelete',
            itemId: 'projectId' },

        back: {
            fn: back },

        additionalProperties: {
            imgPath: '',
            imgFileName: '',
            gridImgPath: '',
            gridImgFileName: '' } });



    var ddlTags = app.$('#ddl-tags');
    var _ddlTags = $(ddlTags);
    var ddlIndustries = app.$('#ddl-industries');
    var _ddlIndustries = $(ddlIndustries);
    var ddlPartners = app.$('#ddl-partners');
    var _ddlPartners = $(ddlPartners);

    _ddlTags.chosen();
    _ddlIndustries.chosen();
    _ddlPartners.chosen();

    var btnUploadGridImg = app.$('#btn-upload-grid-img');
    var fUploadGridImg = app.$('#f-upload-grid-img');
    var prevGridImg = app.$('#prev-grid-img');
    var btnGridImgDelete = app.$('#btn-grid-img-delete');

    var uploadGridImgPath = 'img/projects/';
    var minGridImgWidth = 1000;
    var minGridImgHeight = 590;

    var btnUploadImg = app.$('#btn-upload-img');
    var fUploadImg = app.$('#f-upload-img');
    var prevImg = app.$('#prev-img');
    var btnImgDelete = app.$('#btn-img-delete');

    var uploadPath = 'img/projects/';
    var minImgWidth = 1000;
    var minImgHeight = 762;

    btnUploadGridImg.addEventListener('click', function (e) {return fUploadGridImg.click();});

    fUploadGridImg.addEventListener('change', function (e) {
        var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
        file = files[0];

        adminForm.uploadHelper(file, true, '/admin/uploadImg.ashx', {
            'X-Min-Width': minGridImgWidth,
            'X-Min-Height': minGridImgHeight,
            'X-File-Path': uploadGridImgPath },
        function (rsp) {
            if (rsp) {
                adminForm.setAdditionalPropertyData('gridImgPath', rsp.filePath);
                adminForm.setAdditionalPropertyData('gridImgFileName', rsp.fileName);
                setPrevGridImg(rsp.filePath);
            }

            fUploadGridImg.value = '';
        });
    });

    btnGridImgDelete.addEventListener('click', function (e) {
        alert.promptAlert('Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', function (evt) {
            adminForm.setAdditionalPropertyData('gridImgPath', '');
            adminForm.setAdditionalPropertyData('gridImgFileName', '');
            setPrevGridImg('');
            alert.dismissAlert();
            evt.preventDefault();
        }, function (evt) {
            alert.dismissAlert();
            evt.preventDefault();
        });
    });

    btnUploadImg.addEventListener('click', function (e) {return fUploadImg.click();});

    fUploadImg.addEventListener('change', function (e) {
        var files = e.dataTransfer ? e.dataTransfer.files : e.currentTarget.files,
        file = files[0];

        adminForm.uploadHelper(file, true, '/admin/uploadImg.ashx', {
            'X-Min-Width': minImgWidth,
            'X-Min-Height': minImgHeight,
            'X-File-Path': uploadPath },
        function (rsp) {
            if (rsp) {
                adminForm.setAdditionalPropertyData('imgPath', rsp.filePath);
                adminForm.setAdditionalPropertyData('imgFileName', rsp.fileName);
                setPrevImg(rsp.filePath);
            }

            fUploadImg.value = '';
        });
    });

    btnImgDelete.addEventListener('click', function (e) {
        alert.promptAlert('Confirm Delete', '<p>Are you sure you want to delete this image?', 'Delete', 'Cancel', function (evt) {
            adminForm.setAdditionalPropertyData('imgPath', '');
            adminForm.setAdditionalPropertyData('imgFileName', '');
            setPrevImg('');
            alert.dismissAlert();
            evt.preventDefault();
        }, function (evt) {
            alert.dismissAlert();
            evt.preventDefault();
        });
    });

    function editItemCallback(obj) {
        app.$.fetch('/api/projectTagsGetJson', {
            body: {
                tagId: -1,
                projectId: obj.projectId } }).

        then(function (rsp) {
            if (rsp.success) {
                var tags = rsp.obj;

                tags.forEach(function (tag) {
                    app.$.forEach(ddlTags.children, function (opt) {
                        if (tag.tagId === parseInt(opt.value, 10)) {
                            opt.selected = true;
                        }
                    });
                });

                _ddlTags.trigger('chosen:updated');
            }
        });

        app.$.fetch('/api/industriesGetJson', {
            body: {
                industryId: -1,
                projectId: obj.projectId } }).

        then(function (rsp) {
            if (rsp.success) {
                var industries = rsp.obj;

                industries.forEach(function (ind) {
                    app.$.forEach(ddlIndustries.children, function (opt) {
                        if (ind.industryId === parseInt(opt.value, 10)) {
                            opt.selected = true;
                        }
                    });
                });

                _ddlIndustries.trigger('chosen:updated');
            }
        });

        app.$.fetch('/api/partnersGetJson', {
            body: {
                partnerId: -1,
                projectId: obj.projectId } }).

        then(function (rsp) {
            if (rsp.success) {
                var partners = rsp.obj;

                partners.forEach(function (partner) {
                    app.$.forEach(ddlPartners.children, function (opt) {
                        if (partner.partnerId === parseInt(opt.value, 10)) {
                            opt.selected = true;
                        }
                    });
                });

                _ddlPartners.trigger('chosen:updated');
            }
        });

        setPrevImg(adminForm.getAdditionalPropertyData('imgPath'));
        setPrevGridImg(adminForm.getAdditionalPropertyData('gridImgPath'));
    }

    function setPrevGridImg(filePath) {
        if (filePath === '') {
            prevGridImg.innerHTML = '';
            btnGridImgDelete.classList.add('hidden');
            return;
        }

        prevGridImg.innerHTML = '<img src="' + filePath + '" />';
        btnGridImgDelete.classList.remove('hidden');
    }

    function setPrevImg(filePath) {
        if (filePath === '') {
            prevImg.innerHTML = '';
            btnImgDelete.classList.add('hidden');
            return;
        }

        prevImg.innerHTML = '<img src="' + filePath + '" />';
        btnImgDelete.classList.remove('hidden');
    }

    function saveItemCallback() {
        var tags = [];
        var industries = [];
        var partners = [];

        app.$.forEach(ddlTags.children, function (opt) {
            if (opt.selected) {
                tags.push(opt.value);
            }
        });

        app.$.forEach(ddlIndustries.children, function (opt) {
            if (opt.selected) {
                industries.push(opt.value);
            }
        });

        app.$.forEach(ddlPartners.children, function (opt) {
            if (opt.selected) {
                partners.push(opt.value);
            }
        });

        app.$.fetch('/api/projectsTagsAssign', {
            body: {
                projectId: adminForm.itemId,
                tags: tags } });



        app.$.fetch('/api/projectsIndustriesAssign', {
            body: {
                projectId: adminForm.itemId,
                industries: industries } });



        app.$.fetch('/api/projectsPartnersAssign', {
            body: {
                projectId: adminForm.itemId,
                partners: partners } });


    }

    function back() {
        app.$.forEach(ddlTags.children, function (opt) {
            opt.selected = false;
        });

        app.$.forEach(ddlIndustries.children, function (opt) {
            opt.selected = false;
        });

        app.$.forEach(ddlPartners.children, function (opt) {
            opt.selected = false;
        });

        _ddlTags.trigger('chosen:updated');
        _ddlIndustries.trigger('chosen:updated');
        _ddlPartners.trigger('chosen:updated');

        setPrevGridImg('');
        setPrevImg('');
    }
})(document);
//# sourceMappingURL=projects.js.map
