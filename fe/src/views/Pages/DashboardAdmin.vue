<template>
  <div>
    <div>
      <div
        class="d-flex align-items-center overflow-hidden position-absolute w-100"
        style="height: 66px; padding: 0 30px; top: 0; z-index: 1">
        <h1 class="display-3 font-weight-light text-white m-0">Dashboard Admin</h1>
      </div>
      <base-header style="height:200px" class="pb-8" type="primary"></base-header>
      <div class="container-fluid mt--9">
        <div class="row justify-content-center mb--4">
          <div class="col-lg-12">           
            <div class="card" id="table">
              <div class="col-lg-12 my-4">
                <div class="row col-12 card-deck">
                  <div class="col-4 card text-white position-relative overflow-hidden da-bg-waiting">
                    <div class="da-content">
                      <svg class="da-card-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_246_3865)">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.7725 1.5285C12.5154 1.50952 12.2578 1.50001 12 1.5V0C12.2948 0.000143741 12.5895 0.0111512 12.8835 0.033L12.7725 1.5285ZM15.7785 2.2035C15.2977 2.01796 14.8038 1.86805 14.301 1.755L14.6295 0.291C15.204 0.42 15.7695 0.591 16.3185 0.804L15.7785 2.2035ZM17.8335 3.2685C17.619 3.12547 17.3994 2.99038 17.175 2.8635L17.9145 1.5585C18.4274 1.8491 18.9182 2.17699 19.383 2.5395L18.4605 3.723C18.2571 3.56435 18.048 3.41324 17.8335 3.27V3.2685ZM20.5845 5.9535C20.2878 5.53196 19.9604 5.13288 19.605 4.7595L20.691 3.7245C21.096 4.152 21.471 4.6095 21.8115 5.0895L20.5845 5.9535ZM21.7005 7.9815C21.602 7.74369 21.495 7.50953 21.3795 7.2795L22.719 6.6045C22.9839 7.13113 23.2095 7.67661 23.394 8.2365L21.969 8.706C21.8884 8.4613 21.7988 8.21964 21.7005 7.9815ZM22.4955 11.742C22.4834 11.2265 22.4332 10.7126 22.3455 10.2045L23.823 9.9495C23.9235 10.5285 23.982 11.1165 23.997 11.7045L22.497 11.742H22.4955ZM22.299 14.049C22.3485 13.794 22.389 13.5405 22.4205 13.284L23.91 13.4685C23.838 14.0537 23.7226 14.6328 23.565 15.201L22.119 14.8005C22.188 14.553 22.248 14.3025 22.299 14.049ZM20.871 17.6175C21.147 17.1825 21.39 16.7265 21.6 16.2555L22.971 16.863C22.731 17.403 22.4535 17.922 22.1385 18.42L20.871 17.6175ZM19.425 19.425C19.608 19.242 19.7835 19.053 19.95 18.858L21.087 19.8375C20.8945 20.0608 20.6938 20.2769 20.4855 20.4855L19.425 19.425Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.5C10.2733 1.50012 8.5733 1.92607 7.05055 2.74011C5.5278 3.55415 4.22931 4.73115 3.27007 6.16687C2.31084 7.6026 1.72048 9.25272 1.55128 10.9711C1.38208 12.6895 1.63926 14.423 2.30005 16.0183C2.96084 17.6135 4.00484 19.0212 5.33958 20.1166C6.67431 21.212 8.25859 21.9613 9.95209 22.2982C11.6456 22.6351 13.396 22.5492 15.0484 22.048C16.7007 21.5468 18.204 20.6459 19.425 19.425L20.4855 20.4855C19.0901 21.8817 17.3719 22.9121 15.483 23.4855C13.5942 24.0589 11.5931 24.1575 9.65708 23.7727C7.72102 23.3879 5.90977 22.5315 4.38381 21.2793C2.85785 20.0272 1.66429 18.418 0.908888 16.5943C0.153486 14.7707 -0.140435 12.7888 0.0531671 10.8244C0.246769 8.85999 0.921916 6.97365 2.01879 5.33253C3.11566 3.6914 4.60039 2.34617 6.34143 1.416C8.08247 0.485843 10.0261 -0.000523098 12 4.22187e-07V1.5Z" fill="white"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.25 4.5C11.4489 4.5 11.6397 4.57902 11.7803 4.71967C11.921 4.86032 12 5.05109 12 5.25V13.065L16.872 15.849C17.0397 15.9502 17.1612 16.1129 17.2104 16.3024C17.2597 16.492 17.2329 16.6933 17.1358 16.8633C17.0386 17.0333 16.8788 17.1586 16.6905 17.2124C16.5022 17.2661 16.3003 17.2441 16.128 17.151L10.878 14.151C10.7632 14.0854 10.6678 13.9907 10.6014 13.8764C10.535 13.762 10.5 13.6322 10.5 13.5V5.25C10.5 5.05109 10.579 4.86032 10.7197 4.71967C10.8603 4.57902 11.0511 4.5 11.25 4.5Z" fill="white"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_246_3865">
                            <rect width="24" height="24" fill="white"/>
                          </clipPath>
                        </defs>
                      </svg>
                      <div class="card-body">
                        <p class="da-item">{{ waiting }}</p>
                        <p class="da-desc">Menunggu<br/>Validasi</p>
                      </div>
                    </div>
                    <div class="da-button" @click="filterByStatus('waiting')">
                      <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      <p class="mb-0">Lihat</p>
                      <p class="mb-0">Semua</p>
                    </div>
                  </div>
                  <div class="col-4 card text-white position-relative overflow-hidden da-bg-rejected">
                    <div class="da-content">
                      <svg class="text-white da-card-svg" viewBox="0 0 69 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.3" clip-path="url(#clip0_1157_12635)">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 102.188C27.1475 102.188 39.277 97.1633 48.2202 88.2202C57.1633 79.277 62.1875 67.1475 62.1875 54.5C62.1875 41.8525 57.1633 29.723 48.2202 20.7798C39.277 11.8367 27.1475 6.8125 14.5 6.8125C1.85249 6.8125 -10.277 11.8367 -19.2202 20.7798C-28.1633 29.723 -33.1875 41.8525 -33.1875 54.5C-33.1875 67.1475 -28.1633 79.277 -19.2202 88.2202C-10.277 97.1633 1.85249 102.188 14.5 102.188ZM14.5 109C28.9543 109 42.8166 103.258 53.0373 93.0373C63.2581 82.8166 69 68.9543 69 54.5C69 40.0457 63.2581 26.1834 53.0373 15.9627C42.8166 5.74195 28.9543 0 14.5 0C0.0457001 0 -13.8166 5.74195 -24.0373 15.9627C-34.2581 26.1834 -40 40.0457 -40 54.5C-40 68.9543 -34.2581 82.8166 -24.0373 93.0373C-13.8166 103.258 0.0457001 109 14.5 109Z" fill="white"/>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M40.7554 28.2445C41.0726 28.5609 41.3243 28.9368 41.496 29.3506C41.6677 29.7644 41.7561 30.2081 41.7561 30.6561C41.7561 31.1042 41.6677 31.5478 41.496 31.9616C41.3243 32.3754 41.0726 32.7513 40.7554 33.0677L-6.93209 80.7552C-7.57169 81.3948 -8.43918 81.7542 -9.34371 81.7542C-10.2482 81.7542 -11.1157 81.3948 -11.7553 80.7552C-12.3949 80.1156 -12.7543 79.2481 -12.7543 78.3436C-12.7543 77.4391 -12.3949 76.5716 -11.7553 75.932L35.9322 28.2445C36.2486 27.9273 36.6245 27.6756 37.0383 27.5039C37.4521 27.3322 37.8957 27.2438 38.3438 27.2438C38.7918 27.2438 39.2355 27.3322 39.6493 27.5039C40.0631 27.6756 40.439 27.9273 40.7554 28.2445Z" fill="white"/>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M-11.7554 28.2445C-12.0726 28.5609 -12.3243 28.9368 -12.496 29.3506C-12.6677 29.7644 -12.7561 30.2081 -12.7561 30.6561C-12.7561 31.1042 -12.6677 31.5478 -12.496 31.9616C-12.3243 32.3754 -12.0726 32.7513 -11.7554 33.0677L35.9321 80.7552C36.5717 81.3948 37.4392 81.7542 38.3437 81.7542C39.2482 81.7542 40.1157 81.3948 40.7553 80.7552C41.3949 80.1156 41.7543 79.2481 41.7543 78.3436C41.7543 77.4391 41.3949 76.5716 40.7553 75.932L-6.93217 28.2445C-7.24858 27.9273 -7.62446 27.6756 -8.03829 27.5039C-8.45212 27.3322 -8.89576 27.2438 -9.34379 27.2438C-9.79183 27.2438 -10.2355 27.3322 -10.6493 27.5039C-11.0631 27.6756 -11.439 27.9273 -11.7554 28.2445Z" fill="white"/>
                        </g>
                        <defs>
                          <clipPath id="clip0_1157_12635">
                            <rect width="109" height="109" fill="white" transform="translate(-40)"/>
                          </clipPath>
                        </defs>
                      </svg>

                      <div class="card-body">
                        <p class="da-item">{{ rejected }}</p>
                        <p class="da-desc">Ditolak</p>
                      </div>
                    </div>
                    <div class="da-button" @click="filterByStatus('rejected')">
                      <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      <p class="mb-0">Lihat</p>
                      <p class="mb-0">Semua</p>
                    </div>
                  </div>
                  <div class="col-4 card text-white position-relative overflow-hidden da-bg-accepted">
                    <div class="da-content">
                      <svg class="text-white da-card-svg" viewBox="0 0 69 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.3">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M64.5991 18.0261C64.9163 18.3425 65.168 18.7184 65.3397 19.1323C65.5115 19.5461 65.5998 19.9897 65.5998 20.4378C65.5998 20.8858 65.5115 21.3294 65.3397 21.7433C65.168 22.1571 64.9163 22.533 64.5991 22.8494L16.9116 70.5369C16.5952 70.8541 16.2193 71.1058 15.8055 71.2775C15.3917 71.4492 14.948 71.5376 14.5 71.5376C14.052 71.5376 13.6083 71.4492 13.1945 71.2775C12.7807 71.1058 12.4048 70.8541 12.0884 70.5369L-8.34912 50.0994C-8.66582 49.7827 -8.91704 49.4067 -9.08844 48.9929C-9.25984 48.5791 -9.34805 48.1356 -9.34805 47.6878C-9.34805 47.2399 -9.25984 46.7964 -9.08844 46.3826C-8.91704 45.9688 -8.66582 45.5928 -8.34912 45.2761C-8.03243 44.9594 -7.65645 44.7082 -7.24266 44.5368C-6.82887 44.3654 -6.38538 44.2772 -5.9375 44.2772C-5.48962 44.2772 -5.04612 44.3654 -4.63233 44.5368C-4.21855 44.7082 -3.84257 44.9594 -3.52587 45.2761L14.5 63.3088L59.7759 18.0261C60.0923 17.7089 60.4682 17.4573 60.882 17.2855C61.2958 17.1138 61.7395 17.0254 62.1875 17.0254C62.6355 17.0254 63.0792 17.1138 63.493 17.2855C63.9068 17.4573 64.2827 17.7089 64.5991 18.0261Z" fill="white"/>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 17.0312C7.08939 17.0312 -0.154814 19.2287 -6.31652 23.3458C-12.4782 27.4629 -17.2807 33.3147 -20.1166 40.1613C-22.9525 47.0078 -23.6945 54.5415 -22.2488 61.8097C-20.8031 69.0779 -17.2345 75.7542 -11.9944 80.9943C-6.7543 86.2344 -0.0780106 89.803 7.19022 91.2487C14.4584 92.6945 21.9922 91.9525 28.8387 89.1165C35.6852 86.2806 41.537 81.4781 45.6541 75.3165C49.7713 69.1547 51.9688 61.9105 51.9688 54.4999C51.9688 53.5965 52.3276 52.7301 52.9664 52.0913C53.6052 51.4525 54.4716 51.0937 55.375 51.0937C56.2784 51.0937 57.1448 51.4525 57.7836 52.0913C58.4224 52.7301 58.7813 53.5965 58.7813 54.4999C58.78 64.2475 55.5625 73.7223 49.6277 81.4549C43.6928 89.1875 35.3724 94.7458 25.9567 97.2677C16.541 99.7897 6.55631 99.1344 -2.44898 95.4034C-11.4543 91.6725 -18.9769 85.0744 -23.8501 76.6324C-28.7234 68.1904 -30.6749 58.3764 -29.4021 48.7123C-28.1294 39.0481 -23.7034 30.074 -16.8106 23.1817C-9.91776 16.2893 -0.943357 11.8639 8.72085 10.5917C18.3851 9.31956 28.199 11.2718 36.6406 16.1455C37.0477 16.3585 37.4075 16.6516 37.6983 17.0072C37.9892 17.3628 38.2051 17.7735 38.3331 18.2147C38.4611 18.6559 38.4986 19.1185 38.4432 19.5745C38.3878 20.0306 38.2407 20.4707 38.0108 20.8684C37.7809 21.2661 37.4729 21.6133 37.1054 21.8889C36.7378 22.1645 36.3184 22.3629 35.8721 22.4722C35.4259 22.5815 34.9622 22.5994 34.5089 22.5249C34.0556 22.4503 33.6221 22.2848 33.2344 22.0384C27.5407 18.7458 21.0772 17.0183 14.5 17.0312Z" fill="white"/>
                        </g>
                      </svg>
                      <div class="card-body">
                        <p class="da-item">{{ accepted }}</p>
                        <p class="da-desc">Disetujui</p>
                      </div>
                    </div>
                    <div class="da-button"  @click="filterByStatus('accepted')">
                      <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      <p class="mb-0">Lihat</p>
                      <p class="mb-0">Semua</p>
                    </div>
                  </div>
                  <div class="col-4 card text-white position-relative overflow-hidden da-bg-accepted">
                    <div class="da-content">
                      <svg class="text-white da-card-svg" viewBox="0 0 69 109" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.3">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M64.5991 18.0261C64.9163 18.3425 65.168 18.7184 65.3397 19.1323C65.5115 19.5461 65.5998 19.9897 65.5998 20.4378C65.5998 20.8858 65.5115 21.3294 65.3397 21.7433C65.168 22.1571 64.9163 22.533 64.5991 22.8494L16.9116 70.5369C16.5952 70.8541 16.2193 71.1058 15.8055 71.2775C15.3917 71.4492 14.948 71.5376 14.5 71.5376C14.052 71.5376 13.6083 71.4492 13.1945 71.2775C12.7807 71.1058 12.4048 70.8541 12.0884 70.5369L-8.34912 50.0994C-8.66582 49.7827 -8.91704 49.4067 -9.08844 48.9929C-9.25984 48.5791 -9.34805 48.1356 -9.34805 47.6878C-9.34805 47.2399 -9.25984 46.7964 -9.08844 46.3826C-8.91704 45.9688 -8.66582 45.5928 -8.34912 45.2761C-8.03243 44.9594 -7.65645 44.7082 -7.24266 44.5368C-6.82887 44.3654 -6.38538 44.2772 -5.9375 44.2772C-5.48962 44.2772 -5.04612 44.3654 -4.63233 44.5368C-4.21855 44.7082 -3.84257 44.9594 -3.52587 45.2761L14.5 63.3088L59.7759 18.0261C60.0923 17.7089 60.4682 17.4573 60.882 17.2855C61.2958 17.1138 61.7395 17.0254 62.1875 17.0254C62.6355 17.0254 63.0792 17.1138 63.493 17.2855C63.9068 17.4573 64.2827 17.7089 64.5991 18.0261Z" fill="white"/>
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 17.0312C7.08939 17.0312 -0.154814 19.2287 -6.31652 23.3458C-12.4782 27.4629 -17.2807 33.3147 -20.1166 40.1613C-22.9525 47.0078 -23.6945 54.5415 -22.2488 61.8097C-20.8031 69.0779 -17.2345 75.7542 -11.9944 80.9943C-6.7543 86.2344 -0.0780106 89.803 7.19022 91.2487C14.4584 92.6945 21.9922 91.9525 28.8387 89.1165C35.6852 86.2806 41.537 81.4781 45.6541 75.3165C49.7713 69.1547 51.9688 61.9105 51.9688 54.4999C51.9688 53.5965 52.3276 52.7301 52.9664 52.0913C53.6052 51.4525 54.4716 51.0937 55.375 51.0937C56.2784 51.0937 57.1448 51.4525 57.7836 52.0913C58.4224 52.7301 58.7813 53.5965 58.7813 54.4999C58.78 64.2475 55.5625 73.7223 49.6277 81.4549C43.6928 89.1875 35.3724 94.7458 25.9567 97.2677C16.541 99.7897 6.55631 99.1344 -2.44898 95.4034C-11.4543 91.6725 -18.9769 85.0744 -23.8501 76.6324C-28.7234 68.1904 -30.6749 58.3764 -29.4021 48.7123C-28.1294 39.0481 -23.7034 30.074 -16.8106 23.1817C-9.91776 16.2893 -0.943357 11.8639 8.72085 10.5917C18.3851 9.31956 28.199 11.2718 36.6406 16.1455C37.0477 16.3585 37.4075 16.6516 37.6983 17.0072C37.9892 17.3628 38.2051 17.7735 38.3331 18.2147C38.4611 18.6559 38.4986 19.1185 38.4432 19.5745C38.3878 20.0306 38.2407 20.4707 38.0108 20.8684C37.7809 21.2661 37.4729 21.6133 37.1054 21.8889C36.7378 22.1645 36.3184 22.3629 35.8721 22.4722C35.4259 22.5815 34.9622 22.5994 34.5089 22.5249C34.0556 22.4503 33.6221 22.2848 33.2344 22.0384C27.5407 18.7458 21.0772 17.0183 14.5 17.0312Z" fill="white"/>
                        </g>
                      </svg>
                      <div class="card-body">
                        <p class="da-item">{{ accepted + waiting + rejected }}</p>
                        <p class="da-desc">Total</p>
                      </div>
                    </div>
                    <div class="da-button" @click="filterByStatus(null)">
                      <i class="fa fa-arrow-right" aria-hidden="true"></i>
                      <p class="mb-0">Lihat</p>
                      <p class="mb-0">Semua</p>
                    </div>
                  </div>
                </div>
              </div>
              <el-table
                :data="queriedData"
                row-key="_id"
                header-row-class-name="thead-light"
                @sort-change="sortChange"
                @selection-change="selectionChange">
                <el-table-column label="ID Pendaftaran" prop="_id" min-width />
                <el-table-column label="Nama Industri" prop="umum.compName" min-width align="left" sortable />
                <el-table-column label="Jenis Industri" prop="umum.compType" min-width align="left" sortable />
                <el-table-column label="Alamat" prop="umum.compAddress" min-width align="left" sortable />
                <el-table-column label="No Tlp Industri" prop="umum.compPhone" min-width align="left" sortable />
                <el-table-column label="Email" prop="umum.compMail" min-width align="left" sortable />
                <el-table-column label="Penanggung Jawab" prop="akun.personName" min-width align="left" sortable />
                <el-table-column label="Waktu Dibuat/Diubah" prop="umum.createdAt" sortable >
                    <template v-slot="{ row }">
                      <p class="cell">{{ row.umum.updatedAt ? dateTime(row.umum.updatedAt) : dateTime(row.umum.createdAt) }}</p>
                    </template>
                  </el-table-column>
                <el-table-column label="Status">
                  <template slot-scope="scope">
                    <p v-if="scope.row.validated" class="status status-accepted">Disetujui</p>
                    <template v-else>
                      <p class="status status-rejected" v-if="scope.row.rejected">Ditolak</p>
                      <p class="status status-rejected" v-else>Menunggu Validasi</p>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column label="Aksi">
                  <template slot-scope="action">
                    <button class="action-btn action-btn-view" @click="view(action.row)">View</button>
                  </template>
                </el-table-column>
              </el-table>
              <div
                slot="footer"
                class="col-12 my-2 d-flex justify-content-center justify-content-sm-between flex-wrap">
                <div class="d-flex align-items-center">
                  <p class="card-category mb-0 mr-2">Show</p>
                  <div style="width: 80px">
                    <el-select
                      class="select-primary pagination-select"
                      v-model="pagination.perPage"
                      placeholder="Per page"
                      size="mini">
                      <el-option
                        class="select-primary"
                        v-for="item in pagination.perPageOptions"
                        :key="item"
                        :label="item"
                        :value="item" />
                    </el-select>
                  </div>
                  <p v-if="filter_data.status == false" class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of {{ total }} entries
                    <span v-if="selectedRows.length">
                      {{ selectedRows.length }} rows
                      selected
                    </span>
                  </p>
                  <p v-else class="card-category m-0 ml-2">
                    Showing {{ from + 1 }} to {{ to }} of {{ filter_data.count }} entries
                    <span v-if="selectedRows.length">
                      {{ selectedRows.length }} rows
                      selected
                    </span>
                  </p>
                </div>
                <base-pagination
                  v-if="filter_data.status == false"
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="total" />
                <base-pagination
                  v-else
                  class="pagination-no-border"
                  v-model="pagination.currentPage"
                  :per-page="pagination.perPage"
                  :total="filter_data.count" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from "element-ui";
import { BasePagination, BaseInput } from "@/components";
import clientPaginationMixin from "@/components/clientPaginationMixin";
import axios from "axios";
import defaults from "@/util/defaults";
import moment from "moment";

export default {
  mixins: [clientPaginationMixin],
  components: {
    BasePagination,
    BaseInput,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
  },
  data() {
    return {
      auth: JSON.parse(localStorage.getItem("auth-data")),
      showAddPublicationModal: false,
      showEditPublicationModal: false,
      searchQuery: "",
      selectedRows: [],
      filter_data : {
        count:0,
        status : false
      },
      tableData: [],
      data: [],
      waiting: null,
      rejected: null,
      accepted: null,
    };
  },
  methods: {
    async getData() {
      const { data } = await axios.get(`${defaults.baseURL}/api/v1/dashboardadmin/list`);
      this.tableData = data.list;
      this.data = data.list;
      this.accepted = data.listApprove;
      // this.waiting = data.listProcess;
      this.waiting = data.list.filter((item) => !item.validated && !item.rejected).length;
      this.rejected = data.list.filter((item) => item.rejected).length;
    },
    view(data) {
      this.$store.commit("setPendaftarData", data);
      this.$router.push("/admin/detail/validasi");
    },
    filterByStatus(status) {
      if (status === 'accepted') {
        this.tableData = this.data.filter((item) => item.validated);
      } else if (status === 'waiting') {
        this.tableData = this.data.filter((item) => !item.validated && !item.rejected);
      } else if (status === 'rejected') {
        this.tableData = this.data.filter((item) => item.rejected);
      } else {
        this.tableData = this.data;
      }
    },
    dateTime(timestamp) {
      return moment.unix(timestamp).format("DD/MM/YYYY, HH:mm");
    },
    selectionChange(selectedRows) {
      this.selectedRows = selectedRows;
    },
  },
  created() {
    this.getData();
  },
};
</script>
<style scoped>
.da-content {
  display: flex;
}
.da-button {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #000000;
  opacity: 0.5;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}
.da-bg-waiting {
  background-color: #F2994A;
}
.da-bg-rejected {
  background-color: #EB5757;
}
.da-bg-accepted {
  background-color: #3D9973;
}
.da-item {
  font-size: 40px;
  font-weight: 600;
  line-height: 48px;
  margin-bottom: 0;
}
.da-desc {
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  margin-bottom: 0;
}
.da-card-svg {
  position: absolute;
  left: -20px;
  top: 17px;
  width: 90px;
  height: 90px;
  opacity: 0.5;
  color: #ffffff;
}
.status {
  border-radius: 10px;
  padding: 5px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0;
}
.status-waiting {
  border: 1.5px solid #F2994A;
  color: #F2994A;
}
.status-rejected {
  border: 1.5px solid #EB5757;
  color: #EB5757;
}
.status-accepted {
  border: 1.5px solid #3D9973;
  color: #3D9973;
}
.action-btn {
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 400;
  border: transparent;
  color: #ffffff;
  margin-right: 10px;
  margin-bottom: 10px;
}
.action-btn:focus {
  outline: none;
}
.action-btn-view {
  background-color: #007BFF;
}
</style>
<style lang="scss">
#table {
  .el-table {
    .el-table__row {
      &:hover {
        background: transparent;
        cursor: unset;
      }
    }
  }
}
</style>