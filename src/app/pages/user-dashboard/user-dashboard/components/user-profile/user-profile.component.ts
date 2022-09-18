import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { LogsService } from 'src/app/services/logs/logs.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  userData: any;
  requestsData: any;
  public formBuild: FormGroup = new FormGroup({});
  public filesBuild: FormGroup = new FormGroup({});

  file!: File;
  fileRestriction: Array<any> = ['image/jpeg', 'image/png'];
  isFileValid: boolean = true;

  isEditing: boolean = false;

  constructor(
    private firestore: Firestore,
    private auth: Auth,
    private spinnr: NgxSpinnerService,
    private storage: Storage,
    private toastr: ToastrService,
    private logsService: LogsService
  ) {}

  ngOnInit(): void {
    this.spinnr.show();

    this.getRequests();
    this.getData();
  }
  fileChange(event: any) {
    if (this.fileRestriction.includes(event.target.files[0].type)) {
      this.file = event.target.files[0];
      this.isFileValid = true;
    } else {
      this.toastr.error('Invalid file format');
      this.isFileValid = false;
    }
  }

  buildForm(data: any) {
    this.formBuild = new FormGroup({
      purpose: new FormControl(data.mobile || '', [
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(11),
      ]),
      fullName: new FormControl(data.fullName || '', Validators.required),

      message: new FormControl(data.address || '', Validators.required),
    });
    this.filesBuild = new FormGroup({
      file: new FormControl('', Validators.required),
    });
  }
  getData() {
    const dbInstance = collection(this.firestore, 'users');
    const uid = localStorage.getItem('user');
    if (uid) {
      const q = query(dbInstance, where('uid', '==', uid));
      getDocs(q)
        .then((res) => {
          this.userData = [
            ...res.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            }),
          ];
          this.userData = this.userData[0];
          this.buildForm(this.userData);

          this.spinnr.hide();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Please login');
    }
  }

  getRequests() {
    const dbinstance = collection(this.firestore, 'requests');
    const uid = localStorage.getItem('user');
    if (uid) {
      const q = query(
        dbinstance,
        orderBy('date', 'asc'),

        where('uid', '==', uid)
      );

      getDocs(q)
        .then((res: any) => {
          this.requestsData = [
            ...res.docs.map((doc: any) => {
              return { id: doc.id, ...doc.data() };
            }),
          ];

          this.spinnr.hide();
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      console.log('test');
    }
  }

  uploadFile(event: any) {
    this.spinnr.show();
    const storageRef = ref(this.storage, `images/${this.file.name}`);
    const upload = uploadBytesResumable(storageRef, this.file);

    upload.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);

        if (progress === 100) {
          setTimeout(() => {
            getDownloadURL(upload.snapshot.ref).then((url) => {
              console.log(url);
              this.createDocument(url, upload.snapshot.metadata);
            });
          }, 2000);
        }
      },
      () => {
        getDownloadURL(upload.snapshot.ref).then((url) => {
          console.log('dlurl', url);
        });
      }
    );
  }

  createDocument(url: any, data: any) {
    let user = {
      displayPicture: url,
      
    };
    const updatedoc = doc(this.firestore, 'users', this.userData.id);
    updateDoc(updatedoc, user)
      .then((res: any) => {
        console.log(res);
        this.spinnr.hide();
        this.toastr.success('Image uploaded successfully');
        this.logsService.addLogsService(
          `Added Display Picture`,
          this.userData.username,
          `${this.userData.campus}`,
          this.userData.idNumber
        );
        this.getData();
      })
      .catch((err: any) => {
        console.log(err.message);
      });
    this.getData();
  }

  editProfile() {
    if (this.formBuild.valid) {
      this.spinnr.show();

      let user = {
        mobile: this.formBuild.value.purpose,
        address: this.formBuild.value.message,

        fullName: this.formBuild.value.fullName,
      };
      const updatedoc = doc(this.firestore, 'users', this.userData.id);
      updateDoc(updatedoc, user)
        .then((res: any) => {
          console.log(res);
          this.spinnr.hide();
          this.logsService.addLogsService(
            `Updates user profile  (Name, Mobile, Address)`,
            this.userData.username,
            `${this.userData.campus}`,
            this.userData.idNumber
          );
          this.toastr.success('Information updated successfully');
          this.isEditing = false;

          this.getData();

          // this.formBuild.reset();
        })
        .catch((err: any) => {
          console.log(err.message);
        });
    } else {
      this.toastr.error('Please fill up the fields');
      this.formBuild.markAllAsTouched();
    }
  }
}
